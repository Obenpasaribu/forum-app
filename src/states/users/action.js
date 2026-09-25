import api from '../../api/api';
import { receiveUsers } from './reducer';

export function asyncReceiveUsers() {
  return async (dispatch) => {
    try {
      const users = await api.getAllUsers();
      dispatch(receiveUsers(users));
    } catch (error) {
      alert(error.message);
    }
  };
}
