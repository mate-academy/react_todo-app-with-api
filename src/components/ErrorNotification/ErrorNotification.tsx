import classNames from 'classnames';
import React from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorState: ErrorType;
};

export const ErrorNotification: React.FC<Props> = (props: Props) => {
  const { errorState } = props;

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: Object.values(errorState).every(value => !value),
        },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {!!errorState.length && errorState}
    </div>
  );
};
