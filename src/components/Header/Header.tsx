import React, { RefObject } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  handleSubmit: (event: React.FormEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  titleNewTodo: string;
  loader: boolean;
  updateTodo: (todo: Todo) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  handleSubmit,
  inputRef,
  handleTitleChange,
  titleNewTodo,
  loader,
  updateTodo,
}) => {
  const handleAllToggle = () => {
    const allCompleted = todos.every(todo => todo.completed);

    if (allCompleted) {
      todos.forEach(todo => {
        updateTodo({
          ...todo,
          completed: false,
        });
      });
    } else {
      todos
        .filter(todo => !todo.completed)
        .forEach(todo => {
          updateTodo({
            ...todo,
            completed: true,
          });
        });
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllToggle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          onChange={handleTitleChange}
          value={titleNewTodo}
          disabled={loader}
        />
      </form>
    </header>
  );
};
