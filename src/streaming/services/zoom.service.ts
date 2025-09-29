import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ZoomMeetingResponse, MeetingDetails } from '../interfaces/streaming.interface';

@Injectable()
export class ZoomService {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ZOOM_API_KEY') || '';
    this.apiSecret = this.configService.get<string>('ZOOM_API_SECRET') || '';
    this.baseUrl = 'https://api.zoom.us/v2';
  }

  private generateJWT(): string {
    const jwt = require('jsonwebtoken');
    const payload = {
      iss: this.apiKey,
      exp: Date.now() + 3600 * 1000, // 1 hour
    };

    return jwt.sign(payload, this.apiSecret);
  }

  private async makeZoomRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    const axios = require('axios');
    const token = this.generateJWT();

    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data,
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException(`Zoom API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async createMeeting(topic: string, duration: number, password?: string): Promise<MeetingDetails> {
    const meetingData = {
      topic,
      type: 2, // Scheduled meeting
      duration,
      password: password || this.generatePassword(),
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: false,
        waiting_room: true,
        auto_recording: 'cloud',
      },
    };

    const response: ZoomMeetingResponse = await this.makeZoomRequest('/users/me/meetings', 'POST', meetingData);

    return {
      id: response.id.toString(),
      topic: response.topic,
      startTime: new Date(response.start_time),
      duration: response.duration,
      password: response.password,
      joinUrl: response.join_url,
      hostUrl: response.start_url,
      status: 'scheduled',
      provider: 'zoom',
    };
  }

  async getMeeting(meetingId: string): Promise<MeetingDetails> {
    const response: ZoomMeetingResponse = await this.makeZoomRequest(`/meetings/${meetingId}`);

    return {
      id: response.id.toString(),
      topic: response.topic,
      startTime: new Date(response.start_time),
      duration: response.duration,
      password: response.password,
      joinUrl: response.join_url,
      hostUrl: response.start_url,
      status: response.status === 'waiting' ? 'live' : 'scheduled',
      provider: 'zoom',
    };
  }

  async updateMeeting(meetingId: string, updates: any): Promise<MeetingDetails> {
    const response: ZoomMeetingResponse = await this.makeZoomRequest(`/meetings/${meetingId}`, 'PATCH', updates);

    return {
      id: response.id.toString(),
      topic: response.topic,
      startTime: new Date(response.start_time),
      duration: response.duration,
      password: response.password,
      joinUrl: response.join_url,
      hostUrl: response.start_url,
      status: response.status === 'waiting' ? 'live' : 'scheduled',
      provider: 'zoom',
    };
  }

  async deleteMeeting(meetingId: string): Promise<void> {
    await this.makeZoomRequest(`/meetings/${meetingId}`, 'DELETE');
  }

  async getMeetingParticipants(meetingId: string): Promise<any[]> {
    try {
      const response = await this.makeZoomRequest(`/meetings/${meetingId}/participants`);
      return response.participants || [];
    } catch (error) {
      // Meeting might not be active, return empty array
      return [];
    }
  }

  async endMeeting(meetingId: string): Promise<void> {
    try {
      await this.makeZoomRequest(`/meetings/${meetingId}/status`, 'PUT', {
        action: 'end',
      });
    } catch (error) {
      // Meeting might already be ended
      console.warn(`Failed to end meeting ${meetingId}:`, error.message);
    }
  }

  async getMeetingRecordings(meetingId: string): Promise<any[]> {
    try {
      const response = await this.makeZoomRequest(`/meetings/${meetingId}/recordings`);
      return response.recording_files || [];
    } catch (error) {
      return [];
    }
  }

  private generatePassword(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  async validateMeetingAccess(meetingId: string, password?: string): Promise<boolean> {
    try {
      const meeting = await this.getMeeting(meetingId);
      return !meeting.password || meeting.password === password;
    } catch (error) {
      return false;
    }
  }
}
