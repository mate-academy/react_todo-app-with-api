import { useContext, useMemo } from 'react';
import { CreateTodoForm } from '../CreateTodoForm';
import { TodoContext } from '../../context/Todo.context';
import { editTodo } from '../../api/todos';
import cn from 'classnames';
import { ErrorContext } from '../../context/Error.context';
import { Todo } from '../../types/Todo';

export const Header = () => {
  const { todos, onAddLoadingId, onEditTodo, clearLoadingIds } =
    useContext(TodoContext);
  const { onError } = useContext(ErrorContext);

  const isAllCompleted = useMemo(
    () => todos.every(({ completed }) => completed),
    [todos],
  );

  const toggleAllCompleted = async () => {
    let promises: Promise<Todo>[] = [];

    if (isAllCompleted) {
      promises = todos.map(({ id }) => {
        onAddLoadingId(id);

        return editTodo({ id, completed: false });
      });
    }

    if (!isAllCompleted) {
      const incompleteTodos = todos.filter(({ completed }) => !completed);

      promises = incompleteTodos.map(({ id }) => {
        onAddLoadingId(id);

        return editTodo({ id, completed: true });
      });
    }

    try {
      const responses = await Promise.allSettled(promises);

      responses.forEach(response => {
        if (response.status === 'fulfilled') {
          onEditTodo(response.value);
        } else {
          onError('Unable to update a todo');
        }
      });
    } catch {
      onError('Unable to update a todo');
    } finally {
      clearLoadingIds();
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllCompleted}
        />
      )}

      <CreateTodoForm />
    </header>
  );
};
