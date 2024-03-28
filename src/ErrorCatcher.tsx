import React from 'react';
import { UserWarning } from './UserWarning';

type Props = {
  USER_ID: number,
  children: React.ReactNode,
};

export const ErrorCatcher: React.FC<Props> = ({ USER_ID, children }) => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div>
      {children}
    </div>
  );
};
