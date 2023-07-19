import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

interface Props {
  isTodosPresent: boolean;
  isAllTodosCompleted: boolean;
  toggleAllTodos: () => void;
  addNewTodo: (title: string) => Promise<void>;
}

export const TodoHeader: React.FC<Props> = ({
  isTodosPresent,
  isAllTodosCompleted,
  toggleAllTodos,
  addNewTodo,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const inputField = useRef<HTMLInputElement>(null);
  const didMountRef = useRef(false);

  const clearNewTodoTitle = () => (
    setNewTodoTitle('')
  );

  const formSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsAdding(true);

    addNewTodo(newTodoTitle);

    if (newTodoTitle.trim()) {
      clearNewTodoTitle();
    }

    setIsAdding(false);
  };

  const handleNewTodoTitleChange
  = (event: React.ChangeEvent<HTMLInputElement>) => (
    setNewTodoTitle(event.target.value)
  );

  useEffect(() => {
    if (didMountRef.current && inputField.current) {
      inputField.current.focus();
    }

    if (isTodosPresent) {
      didMountRef.current = true;
    }
  }, [isAdding, isTodosPresent]);

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
