import { Module } from '@nestjs/common';
import { StreamingController } from './controllers/streaming.controller';
import { StreamingService } from './services/streaming.service';
import { ZoomService } from './services/zoom.service';
import { WebRTCService } from './services/webrtc.service';

@Module({
  controllers: [StreamingController],
  providers: [StreamingService, ZoomService, WebRTCService],
  exports: [StreamingService, ZoomService, WebRTCService],
})
export class StreamingModule {}
