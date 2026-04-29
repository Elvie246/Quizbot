const GUEST_ID_STORAGE_KEY = 'quizbotGuestId';

function createGuestId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `guest-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
}

/**
 * Returns a stable guest identifier for the current browser.
 */
export function getOrCreateGuestId() {
  const existingGuestId = localStorage.getItem(GUEST_ID_STORAGE_KEY);
  if (existingGuestId) {
    return existingGuestId;
  }

  const guestId = createGuestId();
  localStorage.setItem(GUEST_ID_STORAGE_KEY, guestId);

  return guestId;
}
