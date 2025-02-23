import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  title: string;
  setTitle: (title: string) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  todos: Todo[];
  submitting: boolean;
};

export const CreateTodoForm: React.FC<Props> = ({
  title,
  setTitle,
  errorMessage,
  setErrorMessage,
  addTodo,
  todos,
  submitting,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    addTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, errorMessage]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitleChange}
        disabled={submitting}
      />
    </form>
  );
};
