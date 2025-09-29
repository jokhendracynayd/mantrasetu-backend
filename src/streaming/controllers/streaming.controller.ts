import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards
} from '@nestjs/common';
import { StreamingService } from '../services/streaming.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { UserContext } from '../../auth/interfaces/auth.interface';
import { CreateMeetingDto, JoinMeetingDto, UpdateMeetingDto, EndMeetingDto, WebRTCSignalDto } from '../dto/streaming.dto';

@Controller('streaming')
@UseGuards(JwtAuthGuard)
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Post('meetings')
  async createMeeting(
    @CurrentUser() currentUser: UserContext,
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    return this.streamingService.createMeeting(createMeetingDto, currentUser);
  }

  @Get('meetings/:id')
  async getMeeting(
    @Param('id') meetingId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.streamingService.getMeeting(meetingId, currentUser);
  }

  @Post('meetings/:id/join')
  async joinMeeting(
    @Param('id') meetingId: string,
    @Body() joinMeetingDto: JoinMeetingDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.streamingService.joinMeeting(meetingId, joinMeetingDto, currentUser);
  }

  @Put('meetings/:id/end')
  async endMeeting(
    @Param('id') meetingId: string,
    @Body() endMeetingDto: EndMeetingDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    await this.streamingService.endMeeting(meetingId, endMeetingDto, currentUser);
    return { message: 'Meeting ended successfully' };
  }

  @Get('meetings/:id/participants')
  async getMeetingParticipants(
    @Param('id') meetingId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.streamingService.getMeetingParticipants(meetingId, currentUser);
  }

  @Post('webrtc/:meetingId/signal')
  async handleWebRTCSignal(
    @Param('meetingId') meetingId: string,
    @Body() signalDto: WebRTCSignalDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    await this.streamingService.handleWebRTCSignal(meetingId, signalDto, currentUser);
    return { message: 'Signal processed successfully' };
  }

  @Get('webrtc/:meetingId/signals')
  async getWebRTCSignalingData(
    @Param('meetingId') meetingId: string,
    @Query('from') fromTimestamp: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    const from = fromTimestamp ? new Date(fromTimestamp) : undefined;
    return this.streamingService.getWebRTCSignalingData(meetingId, currentUser, from);
  }

  @Get('stats')
  async getStreamingStats(@CurrentUser() currentUser: UserContext) {
    return this.streamingService.getStreamingStats(currentUser);
  }
}
