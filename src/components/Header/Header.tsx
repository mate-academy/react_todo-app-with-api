import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { addTodos } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  activeTodos: Todo[] | null
  setTempTodo: (todo: Todo | null) => void,
  setVisibleTodos: (React.Dispatch<React.SetStateAction<Todo[]>>),
  setIsLoading: (React.Dispatch<React.SetStateAction<boolean>>),
  setErrorMessage: (error: ErrorMessage) => void,
  isLoading: boolean,
  toggleAll: () => void,
  USER_ID: number,
};

export const Header: React.FC<Props> = ({
  activeTodos,
  setTempTodo,
  setVisibleTodos,
  setIsLoading,
  setErrorMessage,
  isLoading,
  toggleAll,
  USER_ID,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setTempTodo({
      id: 0,
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    });

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorMessage.titleError);
      setIsLoading(false);
      setTempTodo(null);

      return;
    }

    addTodos(USER_ID, {
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    })
      .then((result) => {
        setVisibleTodos((prevTodos) => {
          return [result, ...prevTodos];
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.addError);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setNewTodoTitle('');
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: activeTodos,
        })}
        aria-label="button"
        onClick={toggleAll}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={newTodoTitle}
          onChange={(e) => handleNewTitle(e)}
        />
      </form>
    </header>
  );
};
