import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ZoomService } from './zoom.service';
import { WebRTCService } from './webrtc.service';
import { CreateMeetingDto, JoinMeetingDto, UpdateMeetingDto, EndMeetingDto, WebRTCSignalDto } from '../dto/streaming.dto';
import { UserContext } from '../../auth/interfaces/auth.interface';
import { MeetingDetails, StreamingStats } from '../interfaces/streaming.interface';
import { StreamingProvider } from '../dto/streaming.dto';

@Injectable()
export class StreamingService {
  constructor(
    private prisma: PrismaService,
    private zoomService: ZoomService,
    private webrtcService: WebRTCService,
  ) {}

  async createMeeting(createMeetingDto: CreateMeetingDto, currentUser: UserContext): Promise<MeetingDetails> {
    const { bookingId, topic, duration, password, provider = StreamingProvider.ZOOM } = createMeetingDto;

    // Verify booking exists and user has access
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: { select: { id: true } },
        pandit: { select: { userId: true } },
        service: { select: { name: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has permission to create meeting for this booking
    const canCreateMeeting = 
      booking.userId === currentUser.userId ||
      booking.pandit.userId === currentUser.userId;

    if (!canCreateMeeting) {
      throw new ForbiddenException('You do not have permission to create a meeting for this booking');
    }

    let meetingDetails: MeetingDetails;

    // Create meeting based on provider
    switch (provider) {
      case StreamingProvider.ZOOM:
        meetingDetails = await this.zoomService.createMeeting(topic, duration, password);
        break;
      case StreamingProvider.WEBRTC:
        // For WebRTC, we create a virtual meeting room
        meetingDetails = {
          id: this.generateMeetingId(),
          topic,
          startTime: new Date(),
          duration,
          password,
          joinUrl: `${process.env.FRONTEND_URL}/meeting/${this.generateMeetingId()}`,
          hostUrl: `${process.env.FRONTEND_URL}/meeting/${this.generateMeetingId()}/host`,
          status: 'scheduled',
          provider: 'webrtc',
        };
        break;
      default:
        throw new BadRequestException('Unsupported streaming provider');
    }

    // Update booking with meeting details
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        meetingLink: meetingDetails.joinUrl,
        meetingPassword: meetingDetails.password,
      },
    });

    return meetingDetails;
  }

  async getMeeting(meetingId: string, currentUser: UserContext): Promise<MeetingDetails> {
    // Find booking by meeting link or ID
    const booking = await this.prisma.booking.findFirst({
      where: {
        OR: [
          { meetingLink: { contains: meetingId } },
          { id: meetingId },
        ],
      },
      include: {
        user: { select: { id: true } },
        pandit: { select: { userId: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Meeting not found');
    }

    // Check if user has access to this meeting
    const hasAccess = 
      booking.userId === currentUser.userId ||
      booking.pandit.userId === currentUser.userId;

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this meeting');
    }

    // Get meeting details from provider
    if (booking.meetingLink?.includes('zoom.us')) {
      const zoomMeetingId = this.extractZoomMeetingId(booking.meetingLink);
      if (zoomMeetingId) {
        return this.zoomService.getMeeting(zoomMeetingId);
      }
    }

    // For WebRTC meetings, return basic details
    return {
      id: meetingId,
      topic: 'Virtual Pooja Session',
      startTime: booking.bookingDate,
      duration: booking.durationMinutes,
      password: booking.meetingPassword || undefined,
      joinUrl: booking.meetingLink || '',
      hostUrl: booking.meetingLink || '',
      status: booking.status === 'IN_PROGRESS' ? 'live' : 'scheduled',
      provider: 'webrtc',
    };
  }

  async joinMeeting(meetingId: string, joinMeetingDto: JoinMeetingDto, currentUser: UserContext): Promise<any> {
    const { password, userName, userEmail } = joinMeetingDto;

    // Find booking
    const booking = await this.prisma.booking.findFirst({
      where: {
        OR: [
          { meetingLink: { contains: meetingId } },
          { id: meetingId },
        ],
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        pandit: { select: { userId: true, user: { select: { firstName: true, lastName: true } } } },
        service: { select: { name: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Meeting not found');
    }

    // Check if user has access
    const hasAccess = 
      booking.userId === currentUser.userId ||
      booking.pandit.userId === currentUser.userId;

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this meeting');
    }

    // Validate password if required
    if (booking.meetingPassword && booking.meetingPassword !== password) {
      throw new BadRequestException('Invalid meeting password');
    }

    // Add participant to WebRTC meeting
    if (booking.meetingLink?.includes('webrtc') || !booking.meetingLink?.includes('zoom.us')) {
      this.webrtcService.addParticipant(meetingId, {
        userId: currentUser.userId,
        userName: userName || `${booking.user.firstName} ${booking.user.lastName}`,
        userEmail: userEmail,
        role: booking.userId === currentUser.userId ? 'participant' : 'host',
        joinTime: new Date(),
        isConnected: true,
      });
    }

    return {
      meetingId,
      joinUrl: booking.meetingLink,
      password: booking.meetingPassword,
      userName: userName || `${booking.user.firstName} ${booking.user.lastName}`,
      role: booking.userId === currentUser.userId ? 'participant' : 'host',
      serviceName: booking.service.name,
    };
  }

  async endMeeting(meetingId: string, endMeetingDto: EndMeetingDto, currentUser: UserContext): Promise<void> {
    const { reason } = endMeetingDto;

    // Find booking
    const booking = await this.prisma.booking.findFirst({
      where: {
        OR: [
          { meetingLink: { contains: meetingId } },
          { id: meetingId },
        ],
      },
      include: {
        pandit: { select: { userId: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Meeting not found');
    }

    // Only pandit can end the meeting
    if (booking.pandit.userId !== currentUser.userId) {
      throw new ForbiddenException('Only the host can end the meeting');
    }

    // End meeting based on provider
    if (booking.meetingLink?.includes('zoom.us')) {
      const zoomMeetingId = this.extractZoomMeetingId(booking.meetingLink);
      if (zoomMeetingId) {
        await this.zoomService.endMeeting(zoomMeetingId);
      }
    } else {
      // Clean up WebRTC meeting
      this.webrtcService.cleanupMeeting(meetingId);
    }

    // Update booking status
    await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  async handleWebRTCSignal(meetingId: string, signalDto: WebRTCSignalDto, currentUser: UserContext): Promise<void> {
    const { signal, type, targetUserId } = signalDto;

    // Verify user has access to the meeting
    const booking = await this.prisma.booking.findFirst({
      where: {
        OR: [
          { meetingLink: { contains: meetingId } },
          { id: meetingId },
        ],
      },
      include: {
        user: { select: { id: true } },
        pandit: { select: { userId: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Meeting not found');
    }

    const hasAccess = 
      booking.userId === currentUser.userId ||
      booking.pandit.userId === currentUser.userId;

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this meeting');
    }

    // Add signaling data
    this.webrtcService.addSignalingData(meetingId, {
      userId: currentUser.userId,
      type,
      signal,
      targetUserId,
      timestamp: new Date(),
    });
  }

  async getWebRTCSignalingData(meetingId: string, currentUser: UserContext, fromTimestamp?: Date): Promise<any[]> {
    // Verify access
    const booking = await this.prisma.booking.findFirst({
      where: {
        OR: [
          { meetingLink: { contains: meetingId } },
          { id: meetingId },
        ],
      },
      include: {
        user: { select: { id: true } },
        pandit: { select: { userId: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Meeting not found');
    }

    const hasAccess = 
      booking.userId === currentUser.userId ||
      booking.pandit.userId === currentUser.userId;

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this meeting');
    }

    return this.webrtcService.getSignalingData(meetingId, fromTimestamp);
  }

  async getMeetingParticipants(meetingId: string, currentUser: UserContext): Promise<any[]> {
    // Verify access
    const booking = await this.prisma.booking.findFirst({
      where: {
        OR: [
          { meetingLink: { contains: meetingId } },
          { id: meetingId },
        ],
      },
      include: {
        user: { select: { id: true } },
        pandit: { select: { userId: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Meeting not found');
    }

    const hasAccess = 
      booking.userId === currentUser.userId ||
      booking.pandit.userId === currentUser.userId;

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this meeting');
    }

    // Get participants based on provider
    if (booking.meetingLink?.includes('zoom.us')) {
      const zoomMeetingId = this.extractZoomMeetingId(booking.meetingLink);
      if (zoomMeetingId) {
        return this.zoomService.getMeetingParticipants(zoomMeetingId);
      }
    }

    // Return WebRTC participants
    return this.webrtcService.getMeetingParticipants(meetingId);
  }

  async getStreamingStats(currentUser: UserContext): Promise<StreamingStats> {
    const where: any = {};

    // For regular users, only show their own stats
    if (currentUser.role === 'USER') {
      where.userId = currentUser.userId;
    }

    // For pandits, show their own stats
    if (currentUser.role === 'PANDIT') {
      const pandit = await this.prisma.pandit.findUnique({
        where: { userId: currentUser.userId },
      });
      if (pandit) {
        where.panditId = pandit.id;
      }
    }

    const [totalMeetings, completedMeetings, totalDuration] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.count({
        where: { ...where, status: 'COMPLETED' },
      }),
      this.prisma.booking.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _sum: { durationMinutes: true },
      }),
    ]);

    return {
      totalMeetings,
      activeMeetings: totalMeetings - completedMeetings,
      totalParticipants: totalMeetings * 2, // Approximate (user + pandit per meeting)
      averageDuration: completedMeetings > 0 ? (totalDuration._sum.durationMinutes || 0) / completedMeetings : 0,
      totalDuration: totalDuration._sum.durationMinutes || 0,
    };
  }

  private generateMeetingId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private extractZoomMeetingId(meetingLink: string): string | null {
    const match = meetingLink.match(/\/j\/(\d+)/);
    return match ? match[1] : null;
  }
}
