/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { TodoError } from '../types/TodoError';

type Props = {
  error: TodoError;
};

export const Errors: React.FC<Props> = ({ error }) => {
  const addErrorMessage = 'Unable to add a todo';
  const deleteErrorMessage = 'Unable to delete a todo';
  const updateErrorMessage = 'Unable to update a todo';
  let message = '';

  switch (error) {
    case TodoError.ADD_ERROR:
      message = addErrorMessage;
      break;

    case TodoError.REMOVE_ERROR:
      message = deleteErrorMessage;
      break;

    case TodoError.UPDATE_ERROR:
      message = updateErrorMessage;
      break;

    default:
      message = 'Unknown error';
  }

  return (
    <>
      <div className=" notification is-danger is-light has-text-weight-normal hidden">
        <button type="button" className="delete" />

        {message}
      </div>
    </>
  );
};
