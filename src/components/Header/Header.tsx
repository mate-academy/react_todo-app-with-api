import {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { TodosContext } from '../TodosContext';
import { ErrorMessage } from '../../types/ErrorMessage';

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const {
    todos,
    tempTodo,
    addTodo,
    toggleTodo,
    setErrorMessage,
    isSubmitting,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const activeTodos = todos.filter(todo => !todo.completed);

  const toggleAllTodos = () => {
    const todosForUpdate = activeTodos.length ? activeTodos : todos;

    todosForUpdate.forEach(todo => toggleTodo(todo.id, { ...todo }));
  };

  const reset = () => {
    setTitle('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.emptyTitle);

      return;
    }

    addTodo(title.trim())
      .then(reset);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !activeTodos.length,
        })}
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
        onClick={toggleAllTodos}
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          ref={inputRef}
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleKeyDown(event);
            }
          }}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
