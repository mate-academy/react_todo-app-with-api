import classNames from 'classnames';
import { useError } from '../ErrorContext/ErrorContext';

export const ErrorNotification = () => {
  const { error, clearError } = useError();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />
      {/* show only one message at a time */}
      {error}
      {/*
      Unable to load todos
      {/* <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
