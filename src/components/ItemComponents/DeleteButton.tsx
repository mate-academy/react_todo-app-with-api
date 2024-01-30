import { useContext } from 'react';
import { TodosContext } from '../TodosContext';

export const DeleteButton: React.FC<{ id: number }> = ({ id }) => {
  const { doDelete } = useContext(TodosContext);

  return (
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => doDelete(id.toString())}
    >
      ×
    </button>
  );
};
