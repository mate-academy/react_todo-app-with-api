import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addNewTodo, USER_ID } from '../api/todos';
import classNames from 'classnames';

type SearchFieldProps = {
  setTitleError: (val: boolean) => void;
  setVisibleTodos: (value: Todo[]) => void;
  setTodos: (value: Todo[]) => void;
  setAddError: (value: boolean) => void;
  setTempTodo: (value: Todo | null) => void;
  setNotificationIsHide: (value: boolean) => void;
  todos: Todo[];
  visibleTodos: Todo[];
  handleUpdateTodo: (id: number, data: Omit<Todo, 'id' | 'userId'>) => void;
};

export const TodoInput: React.FC<SearchFieldProps> = ({
  setTitleError,
  setTodos,
  setVisibleTodos,
  setAddError,
  setTempTodo,
  setNotificationIsHide,
  todos,
  visibleTodos,
  handleUpdateTodo,
}) => {
  // #region TodoInput states
  const [query, setQuery] = useState('');
  // #endregion
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    try {
      const todo = await addNewTodo(newTodo);

      const updatedTodos = [...todos, { ...todo }];

      setVisibleTodos(updatedTodos);
      setTodos(updatedTodos);
    } catch {
      setAddError(false);
      setTimeout(() => setAddError(true), 0);
      throw new Error();
    }
  };

  const setInputDisabled = (value: boolean) => {
    if (inputRef.current) {
      inputRef.current.disabled = value;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setTitleError(false);
      setTimeout(() => setTitleError(true), 0);

      return;
    }

    const plannedTodo = {
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    try {
      setTempTodo(plannedTodo);
      setInputDisabled(true);
      setNotificationIsHide(true);

      await addTodo(plannedTodo);

      setTempTodo(null);
      setQuery('');
    } catch {
      setTempTodo(null);
      throw new Error();
    } finally {
      setInputDisabled(false);
      inputRef.current?.focus();
    }
  };

  const changeInfo = (todoToChange: Todo) => {
    if (!todoToChange.completed) {
      handleUpdateTodo(todoToChange.id, {
        title: todoToChange.title,
        completed: true,
      });

      return;
    }

    if (todos.every(todoStatus => todoStatus.completed === true)) {
      handleUpdateTodo(todoToChange.id, {
        title: todoToChange.title,
        completed: false,
      });
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: visibleTodos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            todos.forEach(todo => changeInfo(todo));
          }}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={query}
          onChange={ev => setQuery(ev.target.value)}
        />
      </form>
    </header>
  );
};
