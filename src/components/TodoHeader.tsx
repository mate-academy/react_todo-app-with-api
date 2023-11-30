import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import * as todosApi from '../api/todos'

type Props = {
  setNewTodo: (value: string) => void;
  newTodo: string;
  setCurrentTodos: (value: React.SetStateAction<Todo[]>) => void;
  setUpdatingTodo: (value: boolean) => void;
  setErrorNotification: (value: string) => void;
  updatingTodo: boolean;
};

export const Header: React.FC<Props> = ({
  newTodo,
  setNewTodo,
  setUpdatingTodo,
  setErrorNotification,
  updatingTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (inputRef.current && !updatingTodo) {
      inputRef.current.focus();
    }
  }, [updatingTodo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newTodo.trim().length === 0) {
      setErrorNotification('Title should not be empty');
      setTimeout(() => {
        setErrorNotification('');
      }, 3000);

      return;
    }

    setUpdatingTodo(true);

    if (inputRef.current && tempTodo) {
      inputRef.current.disabled = true;
    }

    const todoPush: Todo = {
      id: 0,
      userId: 0,
      title: newTodo,
      completed: false,
    };

    setTempTodo(todoPush);

      setNewTodo(newTodo)

      todosApi.createTodo((
        {
          id: new Date().getTime(),
          title: newTodo,
          completed: false,
          userId: 0,
        })
      ).finally(() => setUpdatingTodo(false))

      setNewTodo('');

      setTempTodo(null);

      if (inputRef.current) {
        inputRef.current.disabled = false;
        inputRef.current.focus();
      }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      >
        <span className="sr-only">Add Todo</span>
      </button>

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="newTodo" className="sr-only">
          New Todo
        </label>
        <input
          ref={inputRef}
          id="newTodo"
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          value={newTodo}
          disabled={updatingTodo}
        />
      </form>
    </header>
  );
};
