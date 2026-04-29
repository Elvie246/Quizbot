import { getOrCreateGuestId } from './guestSession';

describe('guestSession', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the existing guest id when one is already stored', () => {
    localStorage.setItem('quizbotGuestId', 'guest-existing');

    expect(getOrCreateGuestId()).toBe('guest-existing');
  });

  it('creates and stores a guest id when none exists', () => {
    const originalCrypto = window.crypto;
    Object.defineProperty(window, 'crypto', {
      configurable: true,
      value: {
        randomUUID: jest.fn(() => 'guest-generated'),
      },
    });

    expect(getOrCreateGuestId()).toBe('guest-generated');
    expect(localStorage.getItem('quizbotGuestId')).toBe('guest-generated');

    Object.defineProperty(window, 'crypto', {
      configurable: true,
      value: originalCrypto,
    });
  });
});
