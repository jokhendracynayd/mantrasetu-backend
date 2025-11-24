import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('uploads')
export class FilesController {
  @Get('pandits/*')
  async servePanditFile(@Param('0') filePath: string, @Res() res: Response) {
    const uploadsDir = join(process.cwd(), 'uploads');
    
    // Try the path as stored in database (with userId subdirectory)
    const fullPath = join(uploadsDir, 'pandits', filePath);
    
    // Check if file exists at the specified path
    if (existsSync(fullPath)) {
      return res.sendFile(fullPath);
    }
    
    // Fallback: try to find file in root pandits folder (for backward compatibility)
    // Extract filename from path (e.g., "userId/filename.png" -> "filename.png")
    const fileName = filePath.split('/').pop();
    if (fileName) {
      const fallbackPath = join(uploadsDir, 'pandits', fileName);
      
      if (existsSync(fallbackPath)) {
        return res.sendFile(fallbackPath);
      }
    }
    
    // File not found in either location
    throw new NotFoundException('File not found');
  }
}

