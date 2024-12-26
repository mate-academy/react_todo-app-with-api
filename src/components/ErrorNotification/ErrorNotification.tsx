import classNames from 'classnames';
import { Errors } from '../../types/Errors';
import { Dispatch, SetStateAction, useEffect } from 'react';

type Props = {
  error: Errors;
  setErrorMessage: Dispatch<SetStateAction<Errors>>;
};
export const ErrorNotification: React.FC<Props> = props => {
  const { error, setErrorMessage } = props;

  useEffect(() => {
    if (!error.length) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(Errors.Empty);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error.length },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Errors.Empty)}
      />
      {error}
    </div>
  );
};
