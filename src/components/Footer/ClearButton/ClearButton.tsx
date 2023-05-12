import classNames from 'classnames';
import { useContext } from 'react';
import { FooterContext } from '../../../context/FooterContext';

export const ClearButton: React.FC = () => {
  const { isCompletedExist, deleteCompletedTodos } = useContext(FooterContext);

  return (
    <button
      type="button"
      className={classNames('todoapp__clear-completed', {
        'todoapp__clear-completed--hide': !isCompletedExist,
      })}
      onClick={deleteCompletedTodos}
    >
      Clear completed
    </button>
  );
};
