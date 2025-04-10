/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import { useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  createTodo: (value: string) => void;
  isLoading: boolean;
  handleToggleAll: () => void;
  shouldFocusCreationForm: React.MutableRefObject<boolean>;
  errorMessage: string;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  newTodoTitle,
  setNewTodoTitle,
  createTodo,
  isLoading,
  handleToggleAll,
  shouldFocusCreationForm,
  errorMessage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createTodo(newTodoTitle);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (shouldFocusCreationForm.current) {
      inputRef.current?.focus();
      shouldFocusCreationForm.current = false;
    }
  }, [todos, errorMessage]);

  return (
    <header className="todoapp__header">
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
