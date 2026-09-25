import { describe, it, expect } from 'vitest';
import threadsReducer, { receiveThreads, addThread, toggleVoteThread } from '../reducer';

/**
 * Skenario pengujian threadsReducer:
 *
 * - receiveThreads action
 *   - should return the threads from the payload when given by receiveThreads
 * - addThread action
 *   - should put the new thread at the beginning of the threads list
 * - toggleVoteThread action (banyak kondisi vote)
 *   - should add the userId to upVotesBy when voteType is 1 (up vote)
 *   - should add the userId to downVotesBy when voteType is -1 (down vote)
 *   - should move the userId from upVotesBy to downVotesBy when the user
 *     switches their vote from up to down
 *   - should remove the userId from both vote lists when voteType is 0
 *     (neutralize vote)
 *   - should return the state unchanged when the threadId does not exist
 * - unknown action
 *   - should return the current state when given an unknown action
 */
describe('threadsReducer', () => {
  it('should return the threads from the payload when given by receiveThreads', () => {
    const initialState = [];
    const threads = [{ id: 'thread-1', title: 'Thread 1' }];

    const nextState = threadsReducer(initialState, receiveThreads(threads));

    expect(nextState).toEqual(threads);
  });

  it('should put the new thread at the beginning of the threads list', () => {
    const initialState = [{ id: 'thread-1', title: 'Thread lama' }];
    const newThread = { id: 'thread-2', title: 'Thread baru' };

    const nextState = threadsReducer(initialState, addThread(newThread));

    expect(nextState).toHaveLength(2);
    expect(nextState[0]).toEqual(newThread);
    expect(nextState[1]).toEqual(initialState[0]);
  });

  it('should add the userId to upVotesBy when voteType is 1 (up vote)', () => {
    const initialState = [
      { id: 'thread-1', upVotesBy: [], downVotesBy: [] },
    ];

    const nextState = threadsReducer(
      initialState,
      toggleVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: 1 }),
    );

    expect(nextState[0].upVotesBy).toEqual(['user-1']);
    expect(nextState[0].downVotesBy).toEqual([]);
  });

  it('should add the userId to downVotesBy when voteType is -1 (down vote)', () => {
    const initialState = [
      { id: 'thread-1', upVotesBy: [], downVotesBy: [] },
    ];

    const nextState = threadsReducer(
      initialState,
      toggleVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: -1 }),
    );

    expect(nextState[0].upVotesBy).toEqual([]);
    expect(nextState[0].downVotesBy).toEqual(['user-1']);
  });

  it('should move the userId from upVotesBy to downVotesBy when the user switches their vote from up to down', () => {
    const initialState = [
      { id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] },
    ];

    const nextState = threadsReducer(
      initialState,
      toggleVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: -1 }),
    );

    expect(nextState[0].upVotesBy).toEqual([]);
    expect(nextState[0].downVotesBy).toEqual(['user-1']);
  });

  it('should remove the userId from both vote lists when voteType is 0 (neutralize vote)', () => {
    const initialState = [
      { id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] },
    ];

    const nextState = threadsReducer(
      initialState,
      toggleVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: 0 }),
    );

    expect(nextState[0].upVotesBy).toEqual([]);
    expect(nextState[0].downVotesBy).toEqual([]);
  });

  it('should return the state unchanged when the threadId does not exist', () => {
    const initialState = [
      { id: 'thread-1', upVotesBy: [], downVotesBy: [] },
    ];

    const nextState = threadsReducer(
      initialState,
      toggleVoteThread({ threadId: 'thread-unknown', userId: 'user-1', voteType: 1 }),
    );

    expect(nextState).toEqual(initialState);
  });

  it('should return the current state when given an unknown action', () => {
    const initialState = [{ id: 'thread-1' }];

    const nextState = threadsReducer(initialState, { type: 'UNKNOWN_ACTION' });

    expect(nextState).toEqual(initialState);
  });
});
