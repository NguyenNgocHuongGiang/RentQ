import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function AutoApiResponse(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
) {
  let responses: Array<MethodDecorator & ClassDecorator> = [];

  switch (method) {
    case 'GET':
      responses = [
        ApiResponse({ status: 200, description: 'Get successful' }),
        ApiResponse({ status: 500, description: 'Internal server error' }),
      ];
      break;
    case 'POST':
      responses = [
        ApiResponse({ status: 201, description: 'Created successfully' }),
        ApiResponse({ status: 400, description: 'Bad request' }),
        ApiResponse({ status: 500, description: 'Internal server error' }),
      ];
      break;
    case 'PUT':
      responses = [
        ApiResponse({ status: 200, description: 'Updated successfully' }),
        ApiResponse({ status: 404, description: 'Not found' }),
        ApiResponse({ status: 500, description: 'Internal server error' }),
      ];
      break;
    case 'PATCH':
      responses = [
        ApiResponse({ status: 200, description: 'Updated successfully' }),
        ApiResponse({ status: 404, description: 'Not found' }),
        ApiResponse({ status: 500, description: 'Internal server error' }),
      ];
      break;
    case 'DELETE':
      responses = [
        ApiResponse({ status: 200, description: 'Deleted successfully' }),
        ApiResponse({ status: 404, description: 'Not found' }),
        ApiResponse({ status: 500, description: 'Internal server error' }),
      ];
      break;
  }

  return applyDecorators(...responses);
}
