import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  updateStatus: (todoId: number, data: Partial<Todo>) => void;
};

export const ToggleButton: React.FC<Props> = ({
  todos,
  updateStatus,
}) => {
  const activeTodos = todos.filter(({ completed }) => !completed);
  const completedTodos = todos.filter(({ completed }) => completed);

  const toggleButtonActive = !activeTodos.length && completedTodos.length;

  const handleStatusTodo = () => {
    return activeTodos.length > 0
      ? activeTodos.map(({ id }) => updateStatus(id, { completed: true }))
      : todos.map(({ id }) => updateStatus(id, { completed: false }));
  };

  return (
    <button
      aria-label="toggle"
      data-cy="ToggleAllButton"
      type="button"
      onClick={handleStatusTodo}
      className={classNames('todoapp__toggle-all',
        {
          active: toggleButtonActive,
        })}
    />
  );
};
