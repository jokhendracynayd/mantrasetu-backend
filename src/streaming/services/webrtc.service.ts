import { Injectable } from '@nestjs/common';
import { WebRTCConnection, MeetingParticipant } from '../interfaces/streaming.interface';

@Injectable()
export class WebRTCService {
  private connections: Map<string, WebRTCConnection> = new Map();
  private meetingParticipants: Map<string, MeetingParticipant[]> = new Map();
  private signalingData: Map<string, any[]> = new Map();

  createConnection(userId: string, meetingId: string): WebRTCConnection {
    const connectionId = this.generateConnectionId();
    const connection: WebRTCConnection = {
      userId,
      meetingId,
      connectionId,
      isConnected: false,
      lastSeen: new Date(),
    };

    this.connections.set(connectionId, connection);
    return connection;
  }

  getConnection(connectionId: string): WebRTCConnection | undefined {
    return this.connections.get(connectionId);
  }

  updateConnectionStatus(connectionId: string, isConnected: boolean): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.isConnected = isConnected;
      connection.lastSeen = new Date();
    }
  }

  removeConnection(connectionId: string): void {
    this.connections.delete(connectionId);
  }

  addParticipant(meetingId: string, participant: MeetingParticipant): void {
    const participants = this.meetingParticipants.get(meetingId) || [];
    const existingIndex = participants.findIndex(p => p.userId === participant.userId);
    
    if (existingIndex >= 0) {
      participants[existingIndex] = participant;
    } else {
      participants.push(participant);
    }
    
    this.meetingParticipants.set(meetingId, participants);
  }

  removeParticipant(meetingId: string, userId: string): void {
    const participants = this.meetingParticipants.get(meetingId) || [];
    const filteredParticipants = participants.filter(p => p.userId !== userId);
    this.meetingParticipants.set(meetingId, filteredParticipants);
  }

  getMeetingParticipants(meetingId: string): MeetingParticipant[] {
    return this.meetingParticipants.get(meetingId) || [];
  }

  addSignalingData(meetingId: string, data: any): void {
    const signaling = this.signalingData.get(meetingId) || [];
    signaling.push({
      ...data,
      timestamp: new Date(),
    });
    this.signalingData.set(meetingId, signaling);
  }

  getSignalingData(meetingId: string, fromTimestamp?: Date): any[] {
    const signaling = this.signalingData.get(meetingId) || [];
    
    if (fromTimestamp) {
      return signaling.filter(s => s.timestamp > fromTimestamp);
    }
    
    return signaling;
  }

  clearSignalingData(meetingId: string): void {
    this.signalingData.delete(meetingId);
  }

  getMeetingStats(meetingId: string): any {
    const participants = this.getMeetingParticipants(meetingId);
    const connections = Array.from(this.connections.values()).filter(c => c.meetingId === meetingId);
    
    return {
      totalParticipants: participants.length,
      connectedParticipants: connections.filter(c => c.isConnected).length,
      meetingId,
      createdAt: new Date(),
    };
  }

  cleanupMeeting(meetingId: string): void {
    // Remove all connections for this meeting
    const connectionsToRemove = Array.from(this.connections.entries())
      .filter(([_, connection]) => connection.meetingId === meetingId)
      .map(([connectionId, _]) => connectionId);
    
    connectionsToRemove.forEach(connectionId => {
      this.connections.delete(connectionId);
    });

    // Clear participants and signaling data
    this.meetingParticipants.delete(meetingId);
    this.signalingData.delete(meetingId);
  }

  private generateConnectionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // ICE Server configuration for WebRTC
  getIceServers(): any[] {
    return [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: 'stun:stun1.l.google.com:19302',
      },
      // Add TURN servers for production
      // {
      //   urls: 'turn:your-turn-server.com:3478',
      //   username: 'username',
      //   credential: 'password',
      // },
    ];
  }

  // Generate offer/answer for WebRTC
  generateOffer(meetingId: string, userId: string): any {
    return {
      type: 'offer',
      meetingId,
      userId,
      timestamp: new Date(),
      iceServers: this.getIceServers(),
    };
  }

  generateAnswer(meetingId: string, userId: string, offer: any): any {
    return {
      type: 'answer',
      meetingId,
      userId,
      offer,
      timestamp: new Date(),
      iceServers: this.getIceServers(),
    };
  }

  generateIceCandidate(meetingId: string, userId: string, candidate: any): any {
    return {
      type: 'ice-candidate',
      meetingId,
      userId,
      candidate,
      timestamp: new Date(),
    };
  }
}
