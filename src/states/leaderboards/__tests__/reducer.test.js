import { describe, it, expect } from 'vitest';
import leaderboardsReducer, { receiveLeaderboards } from '../reducer';

/**
 * Skenario pengujian leaderboardsReducer:
 *
 * - receiveLeaderboards action
 *   - should return the leaderboards from the payload
 *   - should replace the previous leaderboards entirely with the new ones
 *   - should handle an empty leaderboards payload
 * - unknown action
 *   - should return the current state when given an unknown action
 */
describe('leaderboardsReducer', () => {
  it('should return the leaderboards from the payload', () => {
    const initialState = [];
    const leaderboards = [
      { user: { id: 'user-1', name: 'User 1' }, score: 100 },
      { user: { id: 'user-2', name: 'User 2' }, score: 80 },
    ];

    const nextState = leaderboardsReducer(initialState, receiveLeaderboards(leaderboards));

    expect(nextState).toEqual(leaderboards);
  });

  it('should replace the previous leaderboards entirely with the new ones', () => {
    const initialState = [
      { user: { id: 'user-1', name: 'User 1' }, score: 50 },
    ];
    const newLeaderboards = [
      { user: { id: 'user-2', name: 'User 2' }, score: 120 },
    ];

    const nextState = leaderboardsReducer(initialState, receiveLeaderboards(newLeaderboards));

    expect(nextState).toEqual(newLeaderboards);
    expect(nextState).toHaveLength(1);
  });

  it('should handle an empty leaderboards payload', () => {
    const initialState = [
      { user: { id: 'user-1', name: 'User 1' }, score: 50 },
    ];

    const nextState = leaderboardsReducer(initialState, receiveLeaderboards([]));

    expect(nextState).toEqual([]);
  });

  it('should return the current state when given an unknown action', () => {
    const initialState = [
      { user: { id: 'user-1', name: 'User 1' }, score: 50 },
    ];

    const nextState = leaderboardsReducer(initialState, { type: 'UNKNOWN_ACTION' });

    expect(nextState).toEqual(initialState);
  });
});
