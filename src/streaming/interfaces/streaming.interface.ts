export interface MeetingDetails {
  id: string;
  topic: string;
  startTime: Date;
  duration: number;
  password?: string;
  joinUrl: string;
  hostUrl: string;
  status: 'scheduled' | 'live' | 'ended';
  provider: string;
  recordingUrl?: string;
}

export interface ZoomMeetingResponse {
  id: number;
  topic: string;
  start_time: string;
  duration: number;
  password?: string;
  join_url: string;
  start_url: string;
  status: string;
  created_at: string;
}

export interface WebRTCConnection {
  userId: string;
  meetingId: string;
  connectionId: string;
  isConnected: boolean;
  lastSeen: Date;
}

export interface MeetingParticipant {
  userId: string;
  userName: string;
  userEmail?: string;
  role: 'host' | 'participant' | 'co-host';
  joinTime: Date;
  isConnected: boolean;
  connectionId?: string;
}

export interface StreamingStats {
  totalMeetings: number;
  activeMeetings: number;
  totalParticipants: number;
  averageDuration: number;
  totalDuration: number;
}
