import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import api from '../../../api/api';
import { setLoading } from '../../loading/reducer';
import { receiveLeaderboards } from '../reducer';
import { asyncReceiveLeaderboards } from '../action';

vi.mock('../../../api/api');

/**
 * Skenario pengujian thunk pada leaderboards:
 *
 * asyncReceiveLeaderboards thunk
 *   - should dispatch setLoading(true), receiveLeaderboards, then
 *     setLoading(false) on success
 *   - should dispatch only the loading actions (not receiveLeaderboards)
 *     when the API call fails
 *   - should alert the user with the error message when the API call fails
 */
describe('asyncReceiveLeaderboards thunk', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch setLoading(true), receiveLeaderboards, then setLoading(false) on success', async () => {
    const fakeLeaderboards = [
      { user: { id: 'user-1', name: 'User 1' }, score: 100 },
    ];
    api.getLeaderboards.mockResolvedValue(fakeLeaderboards);
    const dispatch = vi.fn();

    await asyncReceiveLeaderboards()(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setLoading({ key: 'leaderboards', value: true }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(2, receiveLeaderboards(fakeLeaderboards));
    expect(dispatch).toHaveBeenNthCalledWith(
      3,
      setLoading({ key: 'leaderboards', value: false }),
    );
  });

  it('should dispatch only the loading actions (not receiveLeaderboards) when the API call fails', async () => {
    api.getLeaderboards.mockRejectedValue(new Error('Gagal memuat leaderboard'));
    const dispatch = vi.fn();

    await asyncReceiveLeaderboards()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setLoading({ key: 'leaderboards', value: true }));
    expect(dispatch).toHaveBeenCalledWith(setLoading({ key: 'leaderboards', value: false }));
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'leaderboards/receiveLeaderboards' }),
    );
  });

  it('should alert the user with the error message when the API call fails', async () => {
    api.getLeaderboards.mockRejectedValue(new Error('Gagal memuat leaderboard'));
    const dispatch = vi.fn();

    await asyncReceiveLeaderboards()(dispatch);

    expect(window.alert).toHaveBeenCalledWith('Gagal memuat leaderboard');
  });
});
