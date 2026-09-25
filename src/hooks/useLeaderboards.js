import { useQuery } from '@tanstack/react-query';
import api from '../api/api';

/**
 * Mengambil data leaderboard lewat React Query.
 *
 * Dibandingkan alur Redux thunk (dispatch -> reducer -> selector),
 * hook ini menangani loading/error state dan caching secara otomatis
 * lewat React Query, dan mudah diuji secara terisolasi via renderHook.
 */
function useLeaderboards() {
  return useQuery({
    queryKey: ['leaderboards'],
    queryFn: () => api.getLeaderboards(),
  });
}

export default useLeaderboards;
