import { useEffect } from 'react';
import '../../styles/index.scss';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  posts: Todo[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ErrorNotification: React.FC<Props> = ({
  setErrorMessage,
  errorMessage,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

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
        onClick={() => setErrorMessage('')}
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
