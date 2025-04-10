import React from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  handleAddTodo: (newTodo: Todo) => void;
  newTitle: string;
  setNewTitle: (newTitle: string) => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  taggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  todos,
  handleAddTodo,
  newTitle,
  setNewTitle,
  loading,
  inputRef,
  taggleAll,
}: Props) => {
  const createTodo = () => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTitle.trim(),
      completed: false,
    };

    handleAddTodo(newTodo);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={taggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          event.preventDefault();
          createTodo();
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event?.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
