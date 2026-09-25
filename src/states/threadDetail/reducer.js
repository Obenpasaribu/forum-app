import { createSlice } from '@reduxjs/toolkit';
import { applyVote } from '../../utils';

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: null,
  reducers: {
    receiveThreadDetail: (state, action) => action.payload,
    clearThreadDetail: () => null,
    addComment: (state, action) => {
      if (!state) return;
      state.comments.unshift(action.payload);
    },
    toggleVoteThreadDetail: (state, action) => {
      if (!state) return;
      const { userId, voteType } = action.payload;
      Object.assign(state, applyVote(state, userId, voteType));
    },
    toggleVoteComment: (state, action) => {
      if (!state) return;
      const { commentId, userId, voteType } = action.payload;
      const comment = state.comments.find((item) => item.id === commentId);
      if (!comment) return;
      const { upVotesBy, downVotesBy } = applyVote(comment, userId, voteType);
      comment.upVotesBy = upVotesBy;
      comment.downVotesBy = downVotesBy;
    },
  },
});

export const {
  receiveThreadDetail,
  clearThreadDetail,
  addComment,
  toggleVoteThreadDetail,
  toggleVoteComment,
} = threadDetailSlice.actions;
export default threadDetailSlice.reducer;
