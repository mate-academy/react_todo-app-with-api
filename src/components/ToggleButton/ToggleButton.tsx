import { useCallback, useMemo } from 'react';
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
  const updateComplete = useMemo(() => (todoType:Todo[], completed:boolean) => {
    todoType.map(({ id }) => updateStatus(id, { completed }));
  }, []);

  const activeTodos = useMemo(() => {
    return todos.filter(
      ({ completed }) => !completed,
    );
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(
      ({ completed }) => completed,
    );
  }, [todos]);

  const toggleButtonActive = !activeTodos.length && completedTodos.length;

  const handleStatusTodo = useCallback(() => {
    return activeTodos.length > 0
      ? updateComplete(activeTodos, true)
      : updateComplete(todos, false);
  }, [activeTodos, todos]);

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
