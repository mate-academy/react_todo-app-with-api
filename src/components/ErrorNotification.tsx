import cn from 'classnames';
import React from 'react';
import { ErrorTypes } from '../types/ErrorType';

type Props = {
  errorMessage: ErrorTypes | null;
};

export const ErrorNotification: React.FC<Props> = ({ errorMessage }) => {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </>
  );
};
