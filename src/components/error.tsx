import { FC, memo, useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';

export const Error: FC = memo(
  () => {
    const {
      noError,
      setNoError,
      errorText,
    } = useContext(GlobalContext);

    return (
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
        hidden={noError}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setNoError(true)}
        />
        {errorText}
      </div>
    );
  },
);
