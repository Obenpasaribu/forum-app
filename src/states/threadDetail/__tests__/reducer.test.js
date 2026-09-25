import { describe, it, expect } from 'vitest';
import threadDetailReducer, {
  receiveThreadDetail,
  clearThreadDetail,
  addComment,
  toggleVoteThreadDetail,
  toggleVoteComment,
} from '../reducer';

/**
 * Skenario pengujian threadDetailReducer:
 *
 * - receiveThreadDetail action
 *   - should return the detail thread from the payload
 * - clearThreadDetail action
 *   - should reset the state back to null
 * - addComment action
 *   - should put the new comment at the beginning of the comments list
 *   - should return the state unchanged when state is null
 * - toggleVoteThreadDetail action (banyak kondisi vote pada thread)
 *   - should add the userId to upVotesBy when voteType is 1
 *   - should move the userId from downVotesBy to upVotesBy when switching vote
 *   - should return the state unchanged when state is null
 * - toggleVoteComment action (banyak kondisi vote pada komentar)
 *   - should add the userId to the target comment's downVotesBy when voteType is -1
 *   - should not change other comments when voting on one comment
 *   - should return the state unchanged when the commentId does not exist
 */
describe('threadDetailReducer', () => {
  it('should return the detail thread from the payload', () => {
    const detailThread = { id: 'thread-1', title: 'Judul thread', comments: [] };

    const nextState = threadDetailReducer(null, receiveThreadDetail(detailThread));

    expect(nextState).toEqual(detailThread);
  });

  it('should reset the state back to null', () => {
    const initialState = { id: 'thread-1', title: 'Judul thread', comments: [] };

    const nextState = threadDetailReducer(initialState, clearThreadDetail());

    expect(nextState).toBeNull();
  });

  it("should put the new comment at the beginning of the comments list", () => {
    const initialState = {
      id: 'thread-1',
      comments: [{ id: 'comment-1', content: 'Komentar lama' }],
    };
    const newComment = { id: 'comment-2', content: 'Komentar baru' };

    const nextState = threadDetailReducer(initialState, addComment(newComment));

    expect(nextState.comments).toHaveLength(2);
    expect(nextState.comments[0]).toEqual(newComment);
  });

  it('should return the state unchanged when state is null (addComment)', () => {
    const nextState = threadDetailReducer(null, addComment({ id: 'comment-1' }));

    expect(nextState).toBeNull();
  });

  it('should add the userId to upVotesBy when voteType is 1', () => {
    const initialState = { id: 'thread-1', upVotesBy: [], downVotesBy: [] };

    const nextState = threadDetailReducer(
      initialState,
      toggleVoteThreadDetail({ userId: 'user-1', voteType: 1 }),
    );

    expect(nextState.upVotesBy).toEqual(['user-1']);
  });

  it('should move the userId from downVotesBy to upVotesBy when switching vote', () => {
    const initialState = { id: 'thread-1', upVotesBy: [], downVotesBy: ['user-1'] };

    const nextState = threadDetailReducer(
      initialState,
      toggleVoteThreadDetail({ userId: 'user-1', voteType: 1 }),
    );

    expect(nextState.upVotesBy).toEqual(['user-1']);
    expect(nextState.downVotesBy).toEqual([]);
  });

  it('should return the state unchanged when state is null (toggleVoteThreadDetail)', () => {
    const nextState = threadDetailReducer(
      null,
      toggleVoteThreadDetail({ userId: 'user-1', voteType: 1 }),
    );

    expect(nextState).toBeNull();
  });

  it("should add the userId to the target comment's downVotesBy when voteType is -1", () => {
    const initialState = {
      id: 'thread-1',
      comments: [
        { id: 'comment-1', upVotesBy: [], downVotesBy: [] },
        { id: 'comment-2', upVotesBy: [], downVotesBy: [] },
      ],
    };

    const nextState = threadDetailReducer(
      initialState,
      toggleVoteComment({ commentId: 'comment-1', userId: 'user-1', voteType: -1 }),
    );

    expect(nextState.comments[0].downVotesBy).toEqual(['user-1']);
    expect(nextState.comments[1].downVotesBy).toEqual([]);
  });

  it('should return the state unchanged when the commentId does not exist', () => {
    const initialState = {
      id: 'thread-1',
      comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: [] }],
    };

    const nextState = threadDetailReducer(
      initialState,
      toggleVoteComment({ commentId: 'comment-unknown', userId: 'user-1', voteType: 1 }),
    );

    expect(nextState).toEqual(initialState);
  });
});
