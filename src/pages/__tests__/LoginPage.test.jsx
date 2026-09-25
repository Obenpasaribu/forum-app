import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../LoginPage';
import loadingReducer from '../../states/loading/reducer';
import * as authUserAction from '../../states/authUser/action';

function renderLoginPage() {
  const store = configureStore({ reducer: { loading: loadingReducer } });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>Halaman Beranda</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

/**
 * Skenario pengujian LoginPage:
 *
 * - should show a validation error and not call asyncSetAuthUser when the
 *   form is submitted empty
 * - should call asyncSetAuthUser with the filled-in email and password
 * - should navigate to the home page when the login thunk resolves true
 * - should stay on the login page when the login thunk resolves false
 */
describe('LoginPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show a validation error and not call asyncSetAuthUser when the form is submitted empty', async () => {
    const spy = vi.spyOn(authUserAction, 'asyncSetAuthUser');
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(await screen.findByText('Email dan kata sandi wajib diisi.')).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call asyncSetAuthUser with the filled-in email and password', async () => {
    vi.spyOn(authUserAction, 'asyncSetAuthUser').mockReturnValue(() => Promise.resolve(true));
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText('Email'), 'dimas@mail.com');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(authUserAction.asyncSetAuthUser).toHaveBeenCalledWith({
      email: 'dimas@mail.com',
      password: 'rahasia',
    });
  });

  it('should navigate to the home page when the login thunk resolves true', async () => {
    vi.spyOn(authUserAction, 'asyncSetAuthUser').mockReturnValue(() => Promise.resolve(true));
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText('Email'), 'dimas@mail.com');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(await screen.findByText('Halaman Beranda')).toBeInTheDocument();
  });

  it('should stay on the login page when the login thunk resolves false', async () => {
    vi.spyOn(authUserAction, 'asyncSetAuthUser').mockReturnValue(() => Promise.resolve(false));
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText('Email'), 'dimas@mail.com');
    await user.type(screen.getByLabelText('Kata sandi'), 'salah');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(await screen.findByRole('button', { name: 'Masuk' })).toBeInTheDocument();
    expect(screen.queryByText('Halaman Beranda')).not.toBeInTheDocument();
  });
});
