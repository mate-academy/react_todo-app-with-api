import classNames from 'classnames';
import { useTodosContext } from '../../hooks/useTodosContext';
import { updateTodo } from '../../api/todos';
import { Errors } from '../../enums/Errors';
import { useEffect, useState } from 'react';

export const ToggleAllButton: React.FC = () => {
  const { todos, completedCount, setLoadingTodoIds, setTodos, showError } =
    useTodosContext();

  const [isAllCompleted, setIsAllCompleted] = useState(false);

  useEffect(() => {
    setIsAllCompleted(completedCount === todos.length);
  }, [todos, completedCount]);

  const toggleCompleted = async (
    todoId: number,
    status: boolean,
  ): Promise<void> => {
    try {
      await updateTodo(todoId, { completed: status });
      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todoId ? { ...t, completed: status } : t)),
      );
    } catch (err) {
      showError(Errors.UpdateTodo);
    } finally {
      setLoadingTodoIds(prevLoadingTodosIds =>
        prevLoadingTodosIds.filter(id => id !== todoId),
      );
    }
  };

  const toggleAllCompleted = () => {
    const notCompleted = todos.filter(todo => !todo.completed);
    const todoIds = notCompleted.map(todo => todo.id);
    const newStatus = !isAllCompleted;

    setLoadingTodoIds(prevLoadingTodosIds => [
      ...prevLoadingTodosIds,
      ...todoIds,
    ]);
    setIsAllCompleted(newStatus);

    const updatePromises = isAllCompleted
      ? todos.map(todo => toggleCompleted(todo.id, newStatus))
      : notCompleted.map(todo => toggleCompleted(todo.id, newStatus));

    Promise.all(updatePromises).catch(() => showError(Errors.UpdateTodo));
  };

  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: todos.length === completedCount,
      })}
      data-cy="ToggleAllButton"
      onClick={toggleAllCompleted}
    />
  );
};
