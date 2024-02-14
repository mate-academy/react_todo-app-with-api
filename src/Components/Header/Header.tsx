/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
} from 'react';
import cn from 'classnames';
import { TodoContext } from '../../TodoContext';

export const Header: React.FC = React.memo(() => {
  const {
    todos,
    postTodo,
    disableInput,
    titleField,
    setDisableInput,
    handleSubmit,
    setError,
    setPostTodo,
    makeTodoCompleted,
  } = useContext(TodoContext);

  const areAllCompleted = () => todos.every((todo) => todo.completed);

  const allTodosCompleted: boolean = areAllCompleted();

  const onSubmitMainInput = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisableInput(true);
    handleSubmit();
    if (!postTodo.trim()) {
      setError('Title should not be empty');
    }
  };

  const toggleAllButtons = () => {
    if (allTodosCompleted) {
      todos.forEach((todo) => {
        makeTodoCompleted(todo.id, todo.completed);
      });
    } else {
      todos.forEach((todo) => {
        if (todo.completed === false) {
          makeTodoCompleted(todo.id, todo.completed);
        }
      });
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllButtons}
        />
      )}

      <form onSubmit={onSubmitMainInput}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField as React.RefObject<HTMLInputElement>}
          disabled={disableInput}
          value={postTodo}
          onChange={(event) => {
            setPostTodo(event.target.value);
          }}
        />
      </form>
    </header>
  );
});
