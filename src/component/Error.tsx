import classNames from 'classnames';
import React from 'react';
type Props = {
  error: string;
  onErrorDeleat: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  onErrorDeleat,
}) => {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => onErrorDeleat()}
        />
        {error}
      </div>
    </>
  );
};
