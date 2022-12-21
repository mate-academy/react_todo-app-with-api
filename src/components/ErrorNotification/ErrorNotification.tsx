/* eslint-disable jsx-a11y/control-has-associated-label */

import { Dispatch, SetStateAction } from 'react';

interface Props {
  errorStatus: string;
  setErrorStatus: Dispatch<SetStateAction<string>>;
}

export const ErrorNotification: React.FC<Props> = (props) => {
  const {
    errorStatus,
    setErrorStatus,
  } = props;

  return (
    <div
      hidden={!errorStatus}
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorStatus('')}
      />
      <span hidden={!errorStatus}>
        {errorStatus}
      </span>
    </div>
  );
};
