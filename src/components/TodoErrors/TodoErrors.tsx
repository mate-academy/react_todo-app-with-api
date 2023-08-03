import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';

export const TodoErrors: React.FC = () => {
  const [isHidden, setIsHidden] = useState(false);

  const {
    errorMessage,
    setErrorMessage,
  } = useContext(TodosContext);

  useEffect(() => {
    const timerid = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerid);
  }, []);

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        className={classNames('delete', {
          hidden: isHidden,
        })}
        aria-label="delete-button"
        onClick={() => setIsHidden(true)}
      />
      {errorMessage}
    </div>
  );
};
