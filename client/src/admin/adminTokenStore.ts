import { Admin } from './authApi';

const LEGACY_STORE_ID = 'loggedUbimapsAdmin';
const STORE_ID = 'loggedUbilocationAdmin';

const get = (): Admin | null => {
  const loggedAdminUserJSON = window.localStorage.getItem(STORE_ID);
  if (!loggedAdminUserJSON) {
    return null;
  }

  return JSON.parse(loggedAdminUserJSON);
};

const set = (adminUser: Admin): void => {
  window.localStorage.setItem(STORE_ID, JSON.stringify(adminUser));
};

const clear = (): void => {
  window.localStorage.removeItem(LEGACY_STORE_ID);
  window.localStorage.removeItem(STORE_ID);
};

export default { get, set, clear };
