import api from '../../api/api';
import { setLoading } from '../loading/reducer';
import { setIsPreload } from '../isPreload/reducer';
import { setAuthUser, unsetAuthUser } from './reducer';

export function asyncSetAuthUser({ email, password }) {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'submit', value: true }));

    try {
      const token = await api.login({ email, password });
      api.putAccessToken(token);

      const user = await api.getOwnProfile();
      dispatch(setAuthUser(user));

      return true;
    } catch (error) {
      alert(error.message);
      return false;
    } finally {
      dispatch(setLoading({ key: 'submit', value: false }));
    }
  };
}

export function asyncRegisterUser({ name, email, password }) {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'submit', value: true }));

    try {
      await api.register({ name, email, password });
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    } finally {
      dispatch(setLoading({ key: 'submit', value: false }));
    }
  };
}

export function asyncUnsetAuthUser() {
  return (dispatch) => {
    api.removeAccessToken();
    dispatch(unsetAuthUser());
  };
}

export function asyncPreloadProcess() {
  return async (dispatch) => {
    dispatch(setIsPreload(true));

    try {
      if (api.getAccessToken()) {
        const user = await api.getOwnProfile();
        dispatch(setAuthUser(user));
      }
    } catch (error) {
      api.removeAccessToken();
      dispatch(unsetAuthUser());
    } finally {
      dispatch(setIsPreload(false));
    }
  };
}
