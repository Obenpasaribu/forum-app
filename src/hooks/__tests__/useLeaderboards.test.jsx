import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import api from '../../api/api';
import useLeaderboards from '../useLeaderboards';

vi.mock('../../api/api');

/**
 * Skenario pengujian useLeaderboards hook (React Query):
 *
 * - should start in a loading state and then return the fetched leaderboards
 * - should expose an error state when the API call fails, without throwing
 * - should call the API only once when the hook is used twice with the
 *   same (still-fresh) QueryClient cache
 */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return Wrapper;
}

describe('useLeaderboards hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start in a loading state and then return the fetched leaderboards', async () => {
    const fakeLeaderboards = [
      { user: { id: 'user-1', name: 'User 1' }, score: 100 },
    ];
    api.getLeaderboards.mockResolvedValue(fakeLeaderboards);

    const { result } = renderHook(() => useLeaderboards(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(fakeLeaderboards);
    expect(result.current.isError).toBe(false);
  });

  it('should expose an error state when the API call fails, without throwing', async () => {
    api.getLeaderboards.mockRejectedValue(new Error('Gagal memuat leaderboard'));

    const { result } = renderHook(() => useLeaderboards(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error.message).toBe('Gagal memuat leaderboard');
    expect(result.current.data).toBeUndefined();
  });

  it('should call the API only once for two hook instances sharing the same cache', async () => {
    api.getLeaderboards.mockResolvedValue([]);
    const wrapper = createWrapper();

    const { result: first } = renderHook(() => useLeaderboards(), { wrapper });
    await waitFor(() => expect(first.current.isLoading).toBe(false));

    const { result: second } = renderHook(() => useLeaderboards(), { wrapper });
    await waitFor(() => expect(second.current.isLoading).toBe(false));

    expect(api.getLeaderboards).toHaveBeenCalledTimes(1);
  });
});
