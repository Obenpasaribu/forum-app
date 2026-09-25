/**
 * Skenario pengujian E2E: Login Aplikasi Forum Diskusi
 *
 * 1. menampilkan halaman login dengan benar
 * 2. menampilkan alert saat email tidak diisi
 * 3. menampilkan alert saat password tidak diisi
 * 4. menampilkan alert saat email dan password yang dimasukkan salah
 * 5. menampilkan homepage dan tidak menampilkan tombol "Masuk" dan "Daftar"
 *    setelah berhasil login
 */
describe('Login Aplikasi Forum Diskusi', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('menampilkan halaman login dengan benar', () => {
    cy.get('a').contains('Masuk').click();

    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button').contains('Masuk').should('be.visible');
  });

  it('menampilkan alert saat email tidak diisi', () => {
    cy.get('a').contains('Masuk').click();

    cy.get('input[name="password"]').type('password_bebas');
    cy.get('button').contains('Masuk').click();

    cy.contains('Email dan kata sandi wajib diisi.').should('be.visible');
  });

  it('menampilkan alert saat password tidak diisi', () => {
    cy.get('a').contains('Masuk').click();

    cy.get('input[name="email"]').type('dimas@mail.com');
    cy.get('button').contains('Masuk').click();

    cy.contains('Email dan kata sandi wajib diisi.').should('be.visible');
  });

  it('menampilkan alert saat email dan password yang dimasukkan salah', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { status: 'fail', message: 'email atau password salah' },
    }).as('loginFailed');

    cy.on('window:alert', cy.stub().as('alertStub'));

    cy.get('a').contains('Masuk').click();
    cy.get('input[name="email"]').type('salah@mail.com');
    cy.get('input[name="password"]').type('passwordsalah');
    cy.get('button').contains('Masuk').click();

    cy.wait('@loginFailed');
    cy.get('@alertStub').should('have.been.calledWith', 'email atau password salah');
    cy.url().should('include', '/login');
  });

  it('menampilkan homepage dan tidak menampilkan tombol "Masuk" dan "Daftar" setelah berhasil login', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { status: 'success', message: 'ok', data: { token: 'fake-access-token' } },
    }).as('loginSuccess');
    cy.intercept('GET', '**/users/me', { fixture: 'user-profile.json' }).as('getOwnProfile');
    cy.intercept('GET', '**/threads', { statusCode: 200, body: { status: 'success', data: { threads: [] } } });
    cy.intercept('GET', '**/users', { statusCode: 200, body: { status: 'success', data: { users: [] } } });

    cy.get('a').contains('Masuk').click();
    cy.get('input[name="email"]').type('dimas@mail.com');
    cy.get('input[name="password"]').type('password_benar');
    cy.get('button').contains('Masuk').click();

    cy.wait('@loginSuccess');
    cy.wait('@getOwnProfile');

    cy.url().should('eq', 'http://localhost:5173/');
    cy.contains('Dimas Ariefiansyah').should('be.visible');
    cy.get('a').contains('Masuk').should('not.exist');
    cy.get('a').contains('Daftar').should('not.exist');
  });
});
