/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../context/TodosContext';

type Props = {
  toHideError: boolean;
  hideError: () => void;
};

export const Error: React.FC<Props> = ({
  toHideError,
  hideError,
}) => {
  const [, , errorMsg] = useContext(TodosContext);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: toHideError },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={hideError}
      />
      {errorMsg}
    </div>
  );
};
