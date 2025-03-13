import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { ErrorTypes } from '../types/ErrorTypes';
import { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  titleRef: React.RefObject<HTMLInputElement>;
  onAdd: (newTodo: Omit<Todo, 'id'>) => void;
  onError: (newErrorOption: ErrorTypes) => void;
  onUpdate: (todosDataUpdate: Todo[]) => Promise<Todo | null>[];
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  titleRef,
  onAdd,
  onError,
  onUpdate,
}) => {
  useEffect(() => {
    titleRef.current?.focus();
  }, [titleRef]);

  const todosAreCompleted = todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent) => {
    const formattedTitle = titleRef.current?.value.trim();

    event.preventDefault();

    if (formattedTitle) {
      onAdd({
        title: formattedTitle,
        userId: +USER_ID,
        completed: false,
      });
    } else {
      onError(ErrorTypes.EmptyTitle);
    }
  };

  const handleTodosToggle = () => {
    let todosDataUpdate;

    if (todosAreCompleted) {
      todosDataUpdate = todos.map(todo => ({ ...todo, completed: false }));
    } else {
      todosDataUpdate = todos
        .filter(todo => !todo.completed)
        .map(todo => ({ ...todo, completed: true }));
    }

    onUpdate(todosDataUpdate);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todosAreCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleTodosToggle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleRef}
        />
      </form>
    </header>
  );
};
