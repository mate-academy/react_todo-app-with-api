/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useContext } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { TodoListContext } from '../../context/TodoListContext';

export const Notifications: React.FC = () => {
  const {
    isErrorShown,
    setIsErrorShown,
    errorType,
  } = useContext(TodoListContext);

  const errorMessage = errorType === ErrorType.TITLE
    ? 'Title can\'t be empty'
    : `Unable to ${errorType} a todo`;

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isErrorShown },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setIsErrorShown(false)}
      />
      {errorMessage}
    </div>
  );
};
