import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { postTodo, USER_ID } from '../api/todos';

type Props = {
  isCreating: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  allCompleted: boolean;
  handleToggleAll: () => void;
  isLoading: boolean;
  todos: Todo[];
  setTempTodo: (todo: Todo | null) => void;
  setIsCreating: (is: boolean) => void;
  setErrorMessage: (error: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const Header: React.FC<Props> = ({
  isCreating,
  inputRef,
  allCompleted,
  handleToggleAll,
  isLoading,
  todos,
  setTempTodo,
  setIsCreating,
  setErrorMessage,
  setTodos,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleAddTodo = () => {
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setIsCreating(true);
    setTempTodo(newTempTodo);

    postTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    } as Omit<Todo, 'id'>)
      .then((createdTodo: Todo) => {
        setTodos(prev => [...prev, createdTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsCreating(false);
        inputRef.current?.focus();
      });
  };

  return (
    <header className="todoapp__header">
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          handleAddTodo();
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isCreating}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
