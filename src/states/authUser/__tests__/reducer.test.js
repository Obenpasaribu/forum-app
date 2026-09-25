import { describe, it, expect } from 'vitest';
import authUserReducer, { setAuthUser, unsetAuthUser } from '../reducer';

/**
 * Skenario pengujian authUserReducer:
 *
 * - setAuthUser action
 *   - should set the auth user from the payload
 *   - should replace an existing auth user with the new one
 * - unsetAuthUser action
 *   - should reset the state back to null
 *   - should remain null when there was no auth user to begin with
 * - unknown action
 *   - should return the current state when given an unknown action
 */
describe('authUserReducer', () => {
  it('should set the auth user from the payload', () => {
    const initialState = null;
    const user = { id: 'user-1', name: 'Dimas Ariefiansyah', email: 'dimas@mail.com' };

    const nextState = authUserReducer(initialState, setAuthUser(user));

    expect(nextState).toEqual(user);
  });

  it('should replace an existing auth user with the new one', () => {
    const initialState = { id: 'user-1', name: 'Dimas' };
    const newUser = { id: 'user-2', name: 'Budi' };

    const nextState = authUserReducer(initialState, setAuthUser(newUser));

    expect(nextState).toEqual(newUser);
  });

  it('should reset the state back to null', () => {
    const initialState = { id: 'user-1', name: 'Dimas' };

    const nextState = authUserReducer(initialState, unsetAuthUser());

    expect(nextState).toBeNull();
  });

  it('should remain null when there was no auth user to begin with', () => {
    const nextState = authUserReducer(null, unsetAuthUser());

    expect(nextState).toBeNull();
  });

  it('should return the current state when given an unknown action', () => {
    const initialState = { id: 'user-1', name: 'Dimas' };

    const nextState = authUserReducer(initialState, { type: 'UNKNOWN_ACTION' });

    expect(nextState).toEqual(initialState);
  });
});
