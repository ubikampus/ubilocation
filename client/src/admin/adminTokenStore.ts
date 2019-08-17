import { Admin } from './authApi';

const STORE_ID = 'loggedUbimapsAdmin';

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
  window.localStorage.removeItem(STORE_ID);
};

export default { get, set, clear };
