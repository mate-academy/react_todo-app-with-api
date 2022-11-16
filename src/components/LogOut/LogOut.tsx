import { FC } from 'react';

type Props = {
  resetUser: () => void;
};

export const LogOut: FC<Props> = ({ resetUser }) => {
  return (
    <div className="logout">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="button logout_button"
        onClick={() => {
          localStorage.clear();
          resetUser();
        }}
      >
        Log out
      </button>
    </div>
  );
};
