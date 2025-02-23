import classNames from 'classnames';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorText } from '../utils/ErrorText';

type Props = {
  isEveryActive: boolean;
  createTodo: (
    event: FormEvent,
    todoText: string,
    setTodoText: (value: string) => void,
  ) => void;
  isLoading: boolean;
  todos: Todo[];
  handleToggleAllTodos: () => void;
  errorMessage: string;
};

export const TodoHeader: React.FC<Props> = ({
  isEveryActive,
  createTodo,
  isLoading,
  todos,
  handleToggleAllTodos,
  errorMessage,
}) => {
  const [todoText, setTodoText] = useState('');
  const submitInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (submitInput.current && errorMessage !== ErrorText.TodoUpdate) {
      submitInput.current.focus();
    }
  }, [todos, isLoading]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            isEveryActive && 'active',
          )}
          data-cy="ToggleAllButton"
          disabled={isLoading}
          onClick={handleToggleAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={event => createTodo(event, todoText, setTodoText)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoText}
          ref={submitInput}
          disabled={isLoading}
          onChange={event => setTodoText(event.target.value)}
        />
      </form>
    </header>
  );
};
