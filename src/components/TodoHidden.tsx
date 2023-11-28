import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  errorNotification: string;
};

export const Hidden: React.FC<Props> = ({ errorNotification }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(!errorNotification);

    const timeout = setTimeout(() => {
      setHidden(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [errorNotification]);

  const hideError = () => {
    setHidden(true);
  };

  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal', {
            hidden,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        >
          { /* button */ }
        </button>
        {errorNotification}
      </div>
    </>
  );
};
