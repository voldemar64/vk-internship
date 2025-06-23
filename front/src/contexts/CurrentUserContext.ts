import React from 'react';

interface CurrentUser {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export const CurrentUserContext = React.createContext<CurrentUser | undefined>(
  undefined,
);