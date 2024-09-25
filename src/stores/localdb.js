/* eslint-disable */
import { LocalStorage } from 'quasar';

export class LocalDB {
  constructor() {
  }

  insert(pair, data) {
    LocalStorage.set(pair, data);
  }

  select(pair) {
    return LocalStorage.getItem(pair);
  }

  remove(key) {
    LocalStorage.remove(key);
  }

  clear() {
    LocalStorage.clear();
  }
}
