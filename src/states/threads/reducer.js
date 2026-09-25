import { createSlice } from '@reduxjs/toolkit';
import { applyVote } from '../../utils';

const threadsSlice = createSlice({
  name: 'threads',
  initialState: [],
  reducers: {
    receiveThreads: (state, action) => action.payload,
    addThread: (state, action) => {
      state.unshift(action.payload);
    },
    toggleVoteThread: (state, action) => {
      const { threadId, userId, voteType } = action.payload;
      const thread = state.find((item) => item.id === threadId);
      if (!thread) return;
      const { upVotesBy, downVotesBy } = applyVote(thread, userId, voteType);
      thread.upVotesBy = upVotesBy;
      thread.downVotesBy = downVotesBy;
    },
  },
});

export const { receiveThreads, addThread, toggleVoteThread } = threadsSlice.actions;
export default threadsSlice.reducer;
