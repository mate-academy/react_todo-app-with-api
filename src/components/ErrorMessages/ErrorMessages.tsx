import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { TodosContext } from '../TodosContext';

export const ErrorMessages: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  useEffect(() => {
    setTimeout(() => setErrorMessage(''), 3000);
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
