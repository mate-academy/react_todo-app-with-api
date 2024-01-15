/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { useTodo } from '../providers/TodoProvider';

export const TodoForm = () => {
  const {
    todos,
    todosLeft,
    newTodoTitle,
    setNewTodoTitle,
    tempTodo,
    updateTodo,
    handleTodoEdit,
  } = useTodo();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [tempTodo, todos]);

  const handleClick = () => {
    const toggle = !!todosLeft;

    todos.forEach((todo) => {
      if (todo.completed !== toggle) {
        updateTodo(todo.id, { completed: toggle });
      }
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleTodoEdit();
  };

  return (
    <>
      {!!todos.length && (

        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !todosLeft,
          })}
          data-cy="ToggleAllButton"
          onClick={handleClick}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleChange}
          ref={inputRef}
          disabled={!!tempTodo}
        />
      </form>

    </>
  );
};
