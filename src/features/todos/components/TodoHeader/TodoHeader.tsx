import React from 'react';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  titleTodo: string;
  toggleAllTodos: () => void;
  setTitleTodo: (value: string) => void;
  handleSubmit: (
    event: React.FormEvent,
    { title, userId, completed }: Omit<Todo, 'id'>,
  ) => void;
  todoInputIsActive: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  titleTodo,
  toggleAllTodos,
  setTitleTodo,
  handleSubmit,
  todoInputIsActive,
  inputRef,
  isLoading,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isLoading && todos.length !== 0 && (
        <button
          type="button"
          className={
            todos.every(todo => todo.completed)
              ? 'todoapp__toggle-all active'
              : 'todoapp__toggle-all'
          }
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={event =>
          handleSubmit(event, {
            title: titleTodo,
            userId: USER_ID,
            completed: false,
          })
        }
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={event => setTitleTodo(event.target.value)}
          disabled={!todoInputIsActive}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
