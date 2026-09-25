import api from '../../api/api';
import { setLoading } from '../loading/reducer';
import { getVoteType } from '../../utils';
import {
  receiveThreadDetail,
  clearThreadDetail,
  addComment,
  toggleVoteThreadDetail,
  toggleVoteComment,
} from './reducer';

export function asyncReceiveThreadDetail(threadId) {
  return async (dispatch) => {
    dispatch(clearThreadDetail());
    dispatch(setLoading({ key: 'threadDetail', value: true }));

    try {
      const detailThread = await api.getThreadDetail(threadId);
      dispatch(receiveThreadDetail(detailThread));
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(setLoading({ key: 'threadDetail', value: false }));
    }
  };
}

export function asyncAddComment(threadId, content) {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'submit', value: true }));

    try {
      const comment = await api.createComment(threadId, content);
      dispatch(addComment(comment));
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(setLoading({ key: 'submit', value: false }));
    }
  };
}

export function asyncVoteThreadDetail(threadId, voteType) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      alert('Anda harus login untuk memberi vote.');
      return;
    }

    const previousVoteType = getVoteType(threadDetail, authUser.id);
    dispatch(toggleVoteThreadDetail({ userId: authUser.id, voteType }));

    try {
      if (voteType === 1) await api.upVoteThread(threadId);
      else if (voteType === -1) await api.downVoteThread(threadId);
      else await api.neutralizeThreadVote(threadId);
    } catch (error) {
      dispatch(toggleVoteThreadDetail({ userId: authUser.id, voteType: previousVoteType }));
      alert(error.message);
    }
  };
}

export function asyncVoteComment(threadId, commentId, voteType) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      alert('Anda harus login untuk memberi vote.');
      return;
    }

    const comment = threadDetail?.comments.find((item) => item.id === commentId);
    const previousVoteType = getVoteType(comment, authUser.id);

    dispatch(toggleVoteComment({ commentId, userId: authUser.id, voteType }));

    try {
      if (voteType === 1) await api.upVoteComment(threadId, commentId);
      else if (voteType === -1) await api.downVoteComment(threadId, commentId);
      else await api.neutralizeCommentVote(threadId, commentId);
    } catch (error) {
      dispatch(toggleVoteComment({ commentId, userId: authUser.id, voteType: previousVoteType }));
      alert(error.message);
    }
  };
}
