import { FC, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  error: string;
  setError: (par: string) => void;
};

export const Notification: FC<Props> = ({
  error,
  setError,
}) => {
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  });

  return (
    // {/* Notification is shown in case of any error */}
    //   {/* Add the 'hidden' class to hide the message smoothly */}
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="close"
        onClick={() => setError('')}
      />
      {/* show only one message at a time
      Unable to load todos
      <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
      {error}
    </div>
  );
};
