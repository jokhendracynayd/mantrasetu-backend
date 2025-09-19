import { PaginationDto } from '../dto/response.dto';

export class ResponseUtil {
  /**
   * Create a paginated response data structure
   */
  static createPaginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ) {
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      message: message || 'Data retrieved successfully',
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Create a simple success response data structure
   */
  static createSuccessResponse<T>(data: T, message?: string) {
    return {
      data,
      message: message || 'Operation completed successfully',
    };
  }

  /**
   * Create a message-only response data structure
   */
  static createMessageResponse(message: string) {
    return {
      data: null,
      message,
    };
  }

  /**
   * Calculate pagination metadata
   */
  static calculatePagination(page: number, limit: number, total: number): PaginationDto {
    const totalPages = Math.ceil(total / limit);
    
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Validate pagination parameters
   */
  static validatePaginationParams(page?: number, limit?: number): { page: number; limit: number } {
    const defaultPage = 1;
    const defaultLimit = 10;
    const maxLimit = 100;

    const validatedPage = Math.max(1, page || defaultPage);
    const validatedLimit = Math.min(Math.max(1, limit || defaultLimit), maxLimit);

    return {
      page: validatedPage,
      limit: validatedLimit,
    };
  }

  /**
   * Calculate offset for database queries
   */
  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
