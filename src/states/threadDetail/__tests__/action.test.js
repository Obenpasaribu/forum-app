import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import api from '../../../api/api';
import { setLoading } from '../../loading/reducer';
import {
  receiveThreadDetail, clearThreadDetail, addComment, toggleVoteThreadDetail, toggleVoteComment,
} from '../reducer';
import {
  asyncReceiveThreadDetail, asyncAddComment, asyncVoteThreadDetail, asyncVoteComment,
} from '../action';

vi.mock('../../../api/api');

/**
 * Skenario pengujian thunk pada threadDetail:
 *
 * asyncReceiveThreadDetail thunk
 *   - should dispatch clearThreadDetail, setLoading(true), receiveThreadDetail,
 *     then setLoading(false) on success
 *   - should not dispatch receiveThreadDetail when the API call fails
 *
 * asyncAddComment thunk
 *   - should dispatch addComment with the created comment on success
 *   - should not dispatch addComment when the API call fails
 *
 * asyncVoteThreadDetail thunk (thunk kompleks: optimistic update + rollback)
 *   - should optimistically dispatch toggleVoteThreadDetail and call the
 *     up-vote endpoint when voteType is 1
 *   - should roll back to the previous vote type when the API call fails
 *   - should alert and dispatch nothing when there is no authUser
 *
 * asyncVoteComment thunk (thunk kompleks: mencari komentar, optimistic update + rollback)
 *   - should optimistically dispatch toggleVoteComment and call the
 *     down-vote comment endpoint when voteType is -1
 *   - should roll back to the previous vote type when the API call fails
 *   - should alert and dispatch nothing when there is no authUser
 */
describe('asyncReceiveThreadDetail thunk', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch clearThreadDetail, setLoading(true), receiveThreadDetail, then setLoading(false) on success', async () => {
    const detailThread = { id: 'thread-1', title: 'Judul', comments: [] };
    api.getThreadDetail.mockResolvedValue(detailThread);
    const dispatch = vi.fn();

    await asyncReceiveThreadDetail('thread-1')(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, clearThreadDetail());
    expect(dispatch).toHaveBeenNthCalledWith(2, setLoading({ key: 'threadDetail', value: true }));
    expect(dispatch).toHaveBeenNthCalledWith(3, receiveThreadDetail(detailThread));
    expect(dispatch).toHaveBeenNthCalledWith(4, setLoading({ key: 'threadDetail', value: false }));
  });

  it('should not dispatch receiveThreadDetail when the API call fails', async () => {
    api.getThreadDetail.mockRejectedValue(new Error('Thread tidak ditemukan'));
    const dispatch = vi.fn();

    await asyncReceiveThreadDetail('thread-unknown')(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'threadDetail/receiveThreadDetail' }),
    );
    expect(window.alert).toHaveBeenCalledWith('Thread tidak ditemukan');
  });
});

describe('asyncAddComment thunk', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch addComment with the created comment on success', async () => {
    const newComment = { id: 'comment-1', content: 'Mantap!' };
    api.createComment.mockResolvedValue(newComment);
    const dispatch = vi.fn();

    await asyncAddComment('thread-1', 'Mantap!')(dispatch);

    expect(api.createComment).toHaveBeenCalledWith('thread-1', 'Mantap!');
    expect(dispatch).toHaveBeenCalledWith(addComment(newComment));
  });

  it('should not dispatch addComment when the API call fails', async () => {
    api.createComment.mockRejectedValue(new Error('Gagal menambah komentar'));
    const dispatch = vi.fn();

    await asyncAddComment('thread-1', 'Mantap!')(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'threadDetail/addComment' }),
    );
    expect(window.alert).toHaveBeenCalledWith('Gagal menambah komentar');
  });
});

describe('asyncVoteThreadDetail thunk', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should optimistically dispatch toggleVoteThreadDetail and call the up-vote endpoint when voteType is 1', async () => {
    api.upVoteThread.mockResolvedValue();
    const dispatch = vi.fn();
    const getState = () => ({
      authUser: { id: 'user-1' },
      threadDetail: { id: 'thread-1', upVotesBy: [], downVotesBy: [] },
    });

    await asyncVoteThreadDetail('thread-1', 1)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      toggleVoteThreadDetail({ userId: 'user-1', voteType: 1 }),
    );
    expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
  });

  it('should roll back to the previous vote type when the API call fails', async () => {
    api.upVoteThread.mockRejectedValue(new Error('Gagal vote'));
    const dispatch = vi.fn();
    const getState = () => ({
      authUser: { id: 'user-1' },
      threadDetail: { id: 'thread-1', upVotesBy: [], downVotesBy: [] },
    });

    await asyncVoteThreadDetail('thread-1', 1)(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      toggleVoteThreadDetail({ userId: 'user-1', voteType: 1 }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      toggleVoteThreadDetail({ userId: 'user-1', voteType: 0 }),
    );
    expect(window.alert).toHaveBeenCalledWith('Gagal vote');
  });

  it('should alert and dispatch nothing when there is no authUser', async () => {
    const dispatch = vi.fn();
    const getState = () => ({ authUser: null, threadDetail: null });

    await asyncVoteThreadDetail('thread-1', 1)(dispatch, getState);

    expect(dispatch).not.toHaveBeenCalled();
    expect(api.upVoteThread).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Anda harus login untuk memberi vote.');
  });
});

describe('asyncVoteComment thunk', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should optimistically dispatch toggleVoteComment and call the down-vote comment endpoint when voteType is -1', async () => {
    api.downVoteComment.mockResolvedValue();
    const dispatch = vi.fn();
    const getState = () => ({
      authUser: { id: 'user-1' },
      threadDetail: {
        id: 'thread-1',
        comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: [] }],
      },
    });

    await asyncVoteComment('thread-1', 'comment-1', -1)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      toggleVoteComment({ commentId: 'comment-1', userId: 'user-1', voteType: -1 }),
    );
    expect(api.downVoteComment).toHaveBeenCalledWith('thread-1', 'comment-1');
  });

  it('should roll back to the previous vote type when the API call fails', async () => {
    api.downVoteComment.mockRejectedValue(new Error('Gagal vote komentar'));
    const dispatch = vi.fn();
    const getState = () => ({
      authUser: { id: 'user-1' },
      threadDetail: {
        id: 'thread-1',
        comments: [{ id: 'comment-1', upVotesBy: ['user-1'], downVotesBy: [] }],
      },
    });

    await asyncVoteComment('thread-1', 'comment-1', -1)(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      toggleVoteComment({ commentId: 'comment-1', userId: 'user-1', voteType: -1 }),
    );
    // Rollback: user had up-voted (voteType 1) before this action.
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      toggleVoteComment({ commentId: 'comment-1', userId: 'user-1', voteType: 1 }),
    );
    expect(window.alert).toHaveBeenCalledWith('Gagal vote komentar');
  });

  it('should alert and dispatch nothing when there is no authUser', async () => {
    const dispatch = vi.fn();
    const getState = () => ({ authUser: null, threadDetail: { comments: [] } });

    await asyncVoteComment('thread-1', 'comment-1', 1)(dispatch, getState);

    expect(dispatch).not.toHaveBeenCalled();
    expect(api.downVoteComment).not.toHaveBeenCalled();
    expect(api.upVoteComment).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Anda harus login untuk memberi vote.');
  });
});
