/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { Todo } from '../types/Type';

type Props = {
  todos: Todo[];
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  updateCompleted: (todoId: number, completed: boolean) => void;
  query: string;
  handleAddTodo: (event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  handleQueryChange,
  updateCompleted,
  query,
  handleAddTodo,
  inputRef,
  isLoading,
}) => {
  const [toggleAllButton, setToggleAllButton] = useState<boolean>(false);

  useEffect(() => {
    setToggleAllButton(todos.every(todo => todo.completed));
  }, [todos]);

  const isAllTodoCompleted = todos.every(todo => todo.completed === true);
  const isAllTodoNotCompleted = todos.every(todo => todo.completed === false);

  const setAllTodoCompleted = () => {
    if (!isAllTodoCompleted && !isAllTodoNotCompleted) {
      todos.map(todo => {
        if (todo.completed === false) {
          updateCompleted(todo.id, todo.completed);
        }
      });
    }

    if (isAllTodoCompleted || isAllTodoNotCompleted) {
      todos.map(todo => {
        updateCompleted(todo.id, todo.completed);
      });
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: toggleAllButton,
          })}
          data-cy="ToggleAllButton"
          onClick={() => setAllTodoCompleted()}
        />
      )}

      <form onSubmit={event => event.preventDefault()}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleAddTodo}
          autoFocus
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
