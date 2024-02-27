/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext } from 'react';
import { DispatchContext } from './TodosContext';

type Props = {
  errorMessage: string;
};

export const ErrorMessage: React.FC<Props> = ({ errorMessage }) => {
  const dispatch = useContext(DispatchContext);

  const handleRemoveError = () => {
    dispatch({
      type: 'errorMessage',
      payload: '',
    });
  };

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleRemoveError}
      />
      {/* show only one message at a time */}
      {errorMessage}
      {/* Unable to load todos
      <br />
      Unable to update a todo */}
    </div>
  );
};
