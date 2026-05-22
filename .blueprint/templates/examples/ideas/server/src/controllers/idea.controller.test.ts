import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdeaController } from './idea.controller';
import { Request, Response } from 'express';

// Mock del servicio
vi.mock('@/services/idea.service', () => {
  return {
    IdeaService: class {
      listIdeas = vi.fn().mockResolvedValue([{ id: 1, title: 'Test Idea' }]);
      createIdea = vi.fn().mockResolvedValue({ id: 2, title: 'New Idea' });
      updateIdea = vi.fn().mockResolvedValue(true);
      deleteIdea = vi.fn().mockResolvedValue(true);
    },
  };
});

import { IdeaService } from '@/services/idea.service';

describe('IdeaController', () => {
  let controller: IdeaController;
  let service: IdeaService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: unknown;
  let responseStatus: number;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new IdeaService({} as any); // El repo no importa aquí por el mock de la clase
    controller = new IdeaController(service);
    responseJson = null;
    responseStatus = 200;

    mockResponse = {
      json: vi.fn().mockImplementation((val) => {
        responseJson = val;
        return mockResponse;
      }),
      status: vi.fn().mockImplementation((val) => {
        responseStatus = val;
        return mockResponse;
      }),
    };
  });

  it('getAll debe retornar una lista de ideas', async () => {
    mockRequest = {};
    await controller.getAll(mockRequest as Request, mockResponse as Response);

    expect(responseJson).toEqual([{ id: 1, title: 'Test Idea' }]);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it('create debe retornar 422 si el body es inválido', async () => {
    mockRequest = {
      body: { title: '' }, // Título vacío debería fallar validación zod
    };

    await controller.create(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toBe(422);
    expect(responseJson.error).toBe('Validación fallida');
  });
});
