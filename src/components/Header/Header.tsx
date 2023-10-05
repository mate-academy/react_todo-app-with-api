import {
  useContext,
  useEffect,
  useRef,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from '../TodoContext';
import * as PostService from '../../api/todos';

export const Header = () => {
  const {
    todos,
    preparedTodos,
    title,
    setTitle,
    setTodos,
    handleSubmit,
    currentLoading,
    setChangingId,
    setCurrentLoading,
  } = useContext(TodoContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length, currentLoading]);

  const updateToggleTodos = () => {
    const allCompleted = preparedTodos.every(
      currentTodo => currentTodo.completed,
    );

    const updatedTodosPromises = todos.map(currentTodo => {
      const newTodo = {
        ...currentTodo,
        completed: !allCompleted,
      };

      if (allCompleted) {
        setChangingId(current => [...current, currentTodo.id]);
      } else {
        setChangingId(current => [...current, currentTodo.completed
          ? 1
          : currentTodo.id,
        ]);
      }

      return PostService.updateTodo(newTodo);
    });

    Promise.all(updatedTodosPromises)
      .then(() => {
        setCurrentLoading(false);
        setTodos(
          todos.map(currentTodo => {
            return { ...currentTodo, completed: !allCompleted };
          }),
        );
      })
      .finally(() => setChangingId([]));
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          aria-label="whatEver"
          onClick={updateToggleTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        action="/"
        method="POST"
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => setTitle(event.target.value)}
          disabled={currentLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
