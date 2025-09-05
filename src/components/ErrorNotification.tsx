import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  error: ErrorMessage;
};

export const ErrorNotification: React.FC<Props> = ({ error }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === null },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error === 'LOAD' && (
        <>
          Unable to load todos
          <br />
        </>
      )}
      {error === 'TITLE' && (
        <>
          Title should not be empty
          <br />
        </>
      )}
      {error === 'ADD' && (
        <>
          Unable to add a todo
          <br />
        </>
      )}
      {error === 'DELETE' && (
        <>
          Unable to delete a todo
          <br />
        </>
      )}
      {error === 'UPDATE' && (
        <>
          Unable to update a todo
          <br />
        </>
      )}
    </div>
  );
};
