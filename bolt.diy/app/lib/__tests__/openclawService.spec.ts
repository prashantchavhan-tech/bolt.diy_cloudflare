import { describe, it, expect, vi } from 'vitest';
import { runAgent } from '../openclawService';
import axios from 'axios';

vi.mock('axios');

describe('openclawService', () => {
  it('should call OpenClaw API via proxy and return content', async () => {
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: 'Hello from OpenClaw',
            },
          },
        ],
      },
    };

    (axios.post as any).mockResolvedValue(mockResponse);

    const result = await runAgent('Hello');

    expect(axios.post).toHaveBeenCalledWith(
      '/openclaw-api/v1/chat/completions',
      {
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'openclaw-agent',
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Bearer'),
        }),
      })
    );
    expect(result).toBe('Hello from OpenClaw');
  });

  it('should throw error on API failure', async () => {
    (axios.post as any).mockRejectedValue(new Error('API Error'));

    await expect(runAgent('Hello')).rejects.toThrow('API Error');
  });
});
