import { Controller, Get, Param, Res, Req, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

// FilesController is excluded from global prefix to serve files at /uploads/* directly
// This works alongside ServeStaticModule which also serves at /uploads/*
@Controller({ path: 'uploads', version: undefined })
export class FilesController {
  @Get('pandits/*')
  async servePanditFile(@Req() req: Request, @Res() res: Response) {
    const uploadsDir = join(process.cwd(), 'uploads');
    
    // Extract file path from request URL
    const urlPath = req.url.split('?')[0]; // Remove query parameters
    const filePath = urlPath.replace('/uploads/pandits/', ''); // Remove prefix
    
    if (!filePath) {
      throw new NotFoundException('File path not provided');
    }
    
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

  @Get('payments/*')
  async servePaymentFile(@Req() req: Request, @Res() res: Response) {
    const uploadsDir = join(process.cwd(), 'uploads');
    
    // Extract file path from request URL
    const urlPath = req.url.split('?')[0]; // Remove query parameters
    const filePath = urlPath.replace('/uploads/payments/', ''); // Remove prefix
    
    if (!filePath) {
      throw new NotFoundException('File path not provided');
    }
    
    const fullPath = join(uploadsDir, 'payments', filePath);
    
    if (existsSync(fullPath)) {
      return res.sendFile(fullPath);
    }
    
    throw new NotFoundException('File not found');
  }

  @Get('users/*')
  async serveUserFile(@Req() req: Request, @Res() res: Response) {
    const uploadsDir = join(process.cwd(), 'uploads');
    
    // Extract file path from request URL
    // URL format: /uploads/users/{userId}/filename.png?query
    const urlPath = req.url.split('?')[0]; // Remove query parameters
    const filePath = urlPath.replace('/uploads/users/', ''); // Remove prefix
    
    if (!filePath) {
      throw new NotFoundException('File path not provided');
    }
    
    // Try the path as stored in database (with userId subdirectory)
    const fullPath = join(uploadsDir, 'users', filePath);
    
    // Check if file exists at the specified path
    if (existsSync(fullPath)) {
      return res.sendFile(fullPath);
    }
    
    // Fallback: try to find file in root users folder (for backward compatibility)
    const fileName = filePath.split('/').pop();
    if (fileName) {
      const fallbackPath = join(uploadsDir, 'users', fileName);
      
      if (existsSync(fallbackPath)) {
        return res.sendFile(fallbackPath);
      }
    }
    
    // File not found in either location
    throw new NotFoundException('File not found');
  }
}

