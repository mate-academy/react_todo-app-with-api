import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  onError: (error: string) => void;
};

export const Error: React.FC<Props> = React.memo(
  ({ errorMessage, onError }) => {
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
          className={classNames('delete')}
          onClick={() => onError('')}
        />
        {errorMessage}
      </div>
    );
  },
);

Error.displayName = 'Error';
