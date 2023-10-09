import { useTodo } from '../../../../context/TodoContext';
import { Todo } from '../../../../types/Todo';

type Props = {
  todo: Todo,
};

export const ToggleInput = ({ todo }: Props) => {
  const {
    toggleCompletedTodos,
  } = useTodo();

  return (
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        onChange={() => toggleCompletedTodos(todo)}
        checked={!!todo.completed}
      />
    </label>

  );
};
