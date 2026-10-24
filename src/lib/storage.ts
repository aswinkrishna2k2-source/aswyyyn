// Web storage throws when a browser blocks site data; nothing that only remembers things should take
// the page down with it, so every read and write goes through these.

type Store = 'local' | 'session';

const get = (store: Store) => (store === 'local' ? localStorage : sessionStorage);

export function readStorage(store: Store, key: string): string | null {
  try {
    return get(store).getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(store: Store, key: string, value: string) {
  try {
    get(store).setItem(key, value);
  } catch {
    /* blocked — it just won't be remembered */
  }
}
