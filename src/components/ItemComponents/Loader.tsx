import classNames from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../TodosContext';

export const Loader: React.FC<{ id: number }> = ({ id }) => {
  const { lids } = useContext(TodosContext);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': !id || lids.has(id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
