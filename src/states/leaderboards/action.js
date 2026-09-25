import api from '../../api/api';
import { setLoading } from '../loading/reducer';
import { receiveLeaderboards } from './reducer';

export function asyncReceiveLeaderboards() {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'leaderboards', value: true }));

    try {
      const leaderboards = await api.getLeaderboards();
      dispatch(receiveLeaderboards(leaderboards));
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(setLoading({ key: 'leaderboards', value: false }));
    }
  };
}
