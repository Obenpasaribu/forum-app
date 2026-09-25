import api from '../../api/api';
import { setLoading } from '../loading/reducer';
import { getVoteType } from '../../utils';
import { receiveThreads, addThread, toggleVoteThread } from './reducer';

export function asyncReceiveThreads() {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'threads', value: true }));

    try {
      const threads = await api.getAllThreads();
      dispatch(receiveThreads(threads));
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(setLoading({ key: 'threads', value: false }));
    }
  };
}

export function asyncAddThread({ title, body, category }) {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'submit', value: true }));

    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThread({ ...thread, totalComments: 0 }));
      return thread.id;
    } catch (error) {
      alert(error.message);
      return null;
    } finally {
      dispatch(setLoading({ key: 'submit', value: false }));
    }
  };
}

export function asyncVoteThread(threadId, voteType) {
  return async (dispatch, getState) => {
    const { authUser, threads } = getState();

    if (!authUser) {
      alert('Anda harus login untuk memberi vote.');
      return;
    }

    const thread = threads.find((item) => item.id === threadId);
    const previousVoteType = getVoteType(thread, authUser.id);

    dispatch(toggleVoteThread({ threadId, userId: authUser.id, voteType }));

    try {
      if (voteType === 1) await api.upVoteThread(threadId);
      else if (voteType === -1) await api.downVoteThread(threadId);
      else await api.neutralizeThreadVote(threadId);
    } catch (error) {
      dispatch(toggleVoteThread({ threadId, userId: authUser.id, voteType: previousVoteType }));
      alert(error.message);
    }
  };
}
