import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import api from '../../../api/api';
import { setLoading } from '../../loading/reducer';
import {
  receiveThreads, addThread, toggleVoteThread,
} from '../reducer';
import {
  asyncReceiveThreads, asyncAddThread, asyncVoteThread,
} from '../action';

vi.mock('../../../api/api');

/**
 * Skenario pengujian thunk pada threads:
 *
 * asyncReceiveThreads thunk
 *   - should dispatch setLoading(true), receiveThreads, then setLoading(false) on success
 *   - should dispatch only the loading actions (not receiveThreads) when the API call fails
 *
 * asyncAddThread thunk
 *   - should dispatch addThread with the created thread and return its id on success
 *   - should not dispatch addThread and should return null when the API call fails
 *
 * asyncVoteThread thunk (thunk kompleks: optimistic update + rollback + banyak dispatch)
 *   - should optimistically dispatch toggleVoteThread and call the up-vote endpoint
 *     when voteType is 1
 *   - should roll back the vote by dispatching toggleVoteThread with the previous
 *     vote type when the API call fails
 *   - should not dispatch anything and should alert the user when there is no authUser
 */
describe('asyncReceiveThreads thunk', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch setLoading(true), receiveThreads, then setLoading(false) on success', async () => {
    const fakeThreads = [{ id: 'thread-1', title: 'Thread 1' }];
    api.getAllThreads.mockResolvedValue(fakeThreads);
    const dispatch = vi.fn();

    await asyncReceiveThreads()(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, setLoading({ key: 'threads', value: true }));
    expect(dispatch).toHaveBeenNthCalledWith(2, receiveThreads(fakeThreads));
    expect(dispatch).toHaveBeenNthCalledWith(3, setLoading({ key: 'threads', value: false }));
  });

  it('should dispatch only the loading actions (not receiveThreads) when the API call fails', async () => {
    api.getAllThreads.mockRejectedValue(new Error('Network error'));
    const dispatch = vi.fn();

    await asyncReceiveThreads()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setLoading({ key: 'threads', value: true }));
    expect(dispatch).toHaveBeenCalledWith(setLoading({ key: 'threads', value: false }));
    expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'threads/receiveThreads' }));
    expect(window.alert).toHaveBeenCalledWith('Network error');
  });
});

describe('asyncAddThread thunk', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch addThread with the created thread and return its id on success', async () => {
    const newThread = { id: 'thread-1', title: 'Judul', body: 'Isi', category: 'umum' };
    api.createThread.mockResolvedValue(newThread);
    const dispatch = vi.fn();

    const result = await asyncAddThread({ title: 'Judul', body: 'Isi', category: 'umum' })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(addThread({ ...newThread, totalComments: 0 }));
    expect(result).toBe('thread-1');
  });

  it('should not dispatch addThread and should return null when the API call fails', async () => {
    api.createThread.mockRejectedValue(new Error('Gagal membuat thread'));
    const dispatch = vi.fn();

    const result = await asyncAddThread({ title: 'Judul', body: 'Isi', category: 'umum' })(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'threads/addThread' }));
    expect(result).toBeNull();
  });
});

describe('asyncVoteThread thunk', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should optimistically dispatch toggleVoteThread and call the up-vote endpoint when voteType is 1', async () => {
    api.upVoteThread.mockResolvedValue();
    const dispatch = vi.fn();
    const getState = () => ({
      authUser: { id: 'user-1' },
      threads: [{ id: 'thread-1', upVotesBy: [], downVotesBy: [] }],
    });

    await asyncVoteThread('thread-1', 1)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      toggleVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: 1 }),
    );
    expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
  });

  it('should roll back the vote by dispatching toggleVoteThread with the previous vote type when the API call fails', async () => {
    api.upVoteThread.mockRejectedValue(new Error('Gagal vote'));
    const dispatch = vi.fn();
    const getState = () => ({
      authUser: { id: 'user-1' },
      threads: [{ id: 'thread-1', upVotesBy: [], downVotesBy: [] }],
    });

    await asyncVoteThread('thread-1', 1)(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      toggleVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: 1 }),
    );
    // Rollback: previous vote type was 0 (no vote yet) before this action.
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      toggleVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: 0 }),
    );
    expect(window.alert).toHaveBeenCalledWith('Gagal vote');
  });

  it('should not dispatch anything and should alert the user when there is no authUser', async () => {
    const dispatch = vi.fn();
    const getState = () => ({ authUser: null, threads: [] });

    await asyncVoteThread('thread-1', 1)(dispatch, getState);

    expect(dispatch).not.toHaveBeenCalled();
    expect(api.upVoteThread).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Anda harus login untuk memberi vote.');
  });
});
