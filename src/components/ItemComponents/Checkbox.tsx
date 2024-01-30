import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';

export const Checkbox: React.FC<{ todo: Todo }> = ({ todo }) => {
  const { doUpdate } = useContext(TodosContext);

  const handleClick = () => {
    doUpdate({ ...todo, completed: !todo.completed });
  };

  return (
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        defaultChecked={todo.completed}
        onClick={handleClick}
      />
    </label>
  );
};
