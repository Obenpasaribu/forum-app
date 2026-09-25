import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import api from '../../../api/api';
import { setAuthUser } from '../reducer';
import { asyncSetAuthUser, asyncRegisterUser } from '../action';

vi.mock('../../../api/api');

/**
 * Skenario pengujian thunk pada authUser:
 *
 * asyncSetAuthUser thunk
 *   - should dispatch setAuthUser with the logged-in user and return true on success
 *   - should store the access token returned by the login API
 *   - should not dispatch setAuthUser and should return false when login fails
 *
 * asyncRegisterUser thunk
 *   - should call the register API with the given data and return true on success
 *   - should return false when registration fails
 */
describe('asyncSetAuthUser thunk', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch setAuthUser with the logged-in user and return true on success', async () => {
    const fakeUser = { id: 'user-1', name: 'Dimas Ariefiansyah' };
    api.login.mockResolvedValue('fake-token');
    api.getOwnProfile.mockResolvedValue(fakeUser);
    const dispatch = vi.fn();

    const result = await asyncSetAuthUser({ email: 'dimas@mail.com', password: 'rahasia' })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setAuthUser(fakeUser));
    expect(result).toBe(true);
  });

  it('should store the access token returned by the login API', async () => {
    api.login.mockResolvedValue('fake-token');
    api.getOwnProfile.mockResolvedValue({ id: 'user-1' });
    const dispatch = vi.fn();

    await asyncSetAuthUser({ email: 'dimas@mail.com', password: 'rahasia' })(dispatch);

    expect(api.putAccessToken).toHaveBeenCalledWith('fake-token');
  });

  it('should not dispatch setAuthUser and should return false when login fails', async () => {
    api.login.mockRejectedValue(new Error('email atau password salah'));
    const dispatch = vi.fn();

    const result = await asyncSetAuthUser({ email: 'salah@mail.com', password: 'salah' })(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'authUser/setAuthUser' }));
    expect(result).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('email atau password salah');
  });
});

describe('asyncRegisterUser thunk', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call the register API with the given data and return true on success', async () => {
    api.register.mockResolvedValue({ id: 'user-1' });
    const dispatch = vi.fn();
    const payload = { name: 'Dimas', email: 'dimas@mail.com', password: 'rahasia' };

    const result = await asyncRegisterUser(payload)(dispatch);

    expect(api.register).toHaveBeenCalledWith(payload);
    expect(result).toBe(true);
  });

  it('should return false when registration fails', async () => {
    api.register.mockRejectedValue(new Error('email sudah terdaftar'));
    const dispatch = vi.fn();

    const result = await asyncRegisterUser({ name: 'Dimas', email: 'dimas@mail.com', password: 'rahasia' })(dispatch);

    expect(result).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('email sudah terdaftar');
  });
});
