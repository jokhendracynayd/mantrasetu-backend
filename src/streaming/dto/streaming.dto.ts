import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export enum StreamingProvider {
  ZOOM = 'zoom',
  WEBRTC = 'webrtc',
  JITSI = 'jitsi',
}

export class CreateMeetingDto {
  @IsString()
  bookingId: string;

  @IsString()
  topic: string;

  @IsNumber()
  duration: number; // in minutes

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  waitingRoom?: boolean;

  @IsOptional()
  @IsBoolean()
  recording?: boolean;

  @IsOptional()
  @IsEnum(StreamingProvider)
  provider?: StreamingProvider;
}

export class JoinMeetingDto {
  @IsString()
  meetingId: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  userEmail?: string;
}

export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  waitingRoom?: boolean;

  @IsOptional()
  @IsBoolean()
  recording?: boolean;
}

export class EndMeetingDto {
  @IsString()
  meetingId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class MeetingParticipantDto {
  @IsString()
  userId: string;

  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsString()
  role?: string; // host, participant, co-host
}

export class WebRTCSignalDto {
  @IsString()
  meetingId: string;

  @IsString()
  signal: string;

  @IsString()
  type: string; // offer, answer, ice-candidate

  @IsOptional()
  @IsString()
  targetUserId?: string;
}
