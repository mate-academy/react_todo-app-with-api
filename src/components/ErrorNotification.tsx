/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../context/TodoContext';

type Props = {
  toHideError: boolean,
  hideError: () => void,
};

export const ErrorNotification: React.FC<Props> = ({
  toHideError,
  hideError,
}) => {
  const [, ,errorMsg, ,] = useContext(TodosContext);

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
