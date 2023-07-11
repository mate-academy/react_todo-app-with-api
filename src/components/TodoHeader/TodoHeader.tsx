import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../types/ErrorMessages';
import { createTodo } from '../../api/todos';

interface Props {
  isTodosPresent: boolean;
  isAllTodosCompleted: boolean;
  toggleAllTodos: () => void;
  setTempTodo: (todo: Todo | null) => void;
  setErrorMessage: (errorName: ErrorMessages) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  USER_ID: number;
}

export const TodoHeader: React.FC<Props> = ({
  isTodosPresent,
  isAllTodosCompleted,
  toggleAllTodos,
  setTempTodo,
  setErrorMessage,
  setTodos,
  USER_ID,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleNewTodoTitleChange
  = (event: React.ChangeEvent<HTMLInputElement>) => (
    setNewTodoTitle(event.target.value)
  );

  const clearNewTodoTitle = () => (
    setNewTodoTitle('')
  );

  const addNewTodo = async (title: string) => {
    if (!title) {
      setErrorMessage(ErrorMessages.TitleError);

      return;
    }

    try {
      const newTodoPayload = {
        completed: false,
        title,
        userId: USER_ID,
      };

      setTempTodo({
        id: 0,
        ...newTodoPayload,
      });

      const newTodo = await createTodo(newTodoPayload);

      clearNewTodoTitle();
      setTodos((prevState) => [...prevState, newTodo]);
    } catch (error) {
      setErrorMessage(ErrorMessages.TitleError);
    } finally {
      setTempTodo(null);
    }
  };

  const inputField = useRef<HTMLInputElement>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current && inputField.current) {
      inputField.current.focus();
    }

    if (isTodosPresent) {
      didMountRef.current = true;
    }
  }, [isAdding, isTodosPresent]);

  const formSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsAdding(true);

    addNewTodo(newTodoTitle);

    setIsAdding(false);
  };

  return (
    <header className="todoapp__header">
      {isTodosPresent && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: isAllTodosCompleted },
          )}
          aria-label="Show todos"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={formSubmitHandler}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleNewTodoTitleChange}
          disabled={isAdding}
          ref={inputField}
        />
      </form>
    </header>
  );
};
