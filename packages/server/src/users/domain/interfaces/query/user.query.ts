import { UUID } from '../../../../core';

export type UserSelectorByUUID = { uuid: UUID };
export type UserSelectorByEmail = { email: string };
export type UserSelectorByToken = { token: UUID };

export type UserSelector =
  | UserSelectorByUUID
  | UserSelectorByEmail
  | UserSelectorByToken;

export const userSelector = {
  isUuid(selector: UserSelector): selector is UserSelectorByUUID {
    const key: keyof UserSelectorByUUID = 'uuid';
    return Object.keys(selector).includes(key);
  },
  isEmail(selector: UserSelector): selector is UserSelectorByEmail {
    const key: keyof UserSelectorByEmail = 'email';
    return Object.keys(selector).includes(key);
  },
  isToken(selector: UserSelector): selector is UserSelectorByToken {
    const key: keyof UserSelectorByToken = 'token';
    return Object.keys(selector).includes(key);
  },
};
