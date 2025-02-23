import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, postTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../types/Error';

type Props = {
  todos: Todo[];
  onAdd: (todo: Todo) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  handleToggleAll: () => void;
  isActive: boolean;
  isSubmittingEnter: boolean;
  setIsSubmittingEnter: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onAdd,
  setErrorMessage,
  setTempTodo,
  handleToggleAll,
  isActive,
  isSubmittingEnter,
  setIsSubmittingEnter,
  isLoading,
}) => {
  const field = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    field.current?.focus();
  }, [todos, isSubmitting]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setErrorMessage(ErrorMessages.EMPTY_TITLE);
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setIsSubmitting(true);
      const todo = {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
        id: 0,
      };

      setTempTodo(todo);
      postTodos(title.trim())
        .then(newTodo => {
          onAdd(newTodo);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.UNABLE_TO_ADD);
          setTimeout(() => setErrorMessage(null), 3000);
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodo(null);
          setIsSubmittingEnter(!isSubmittingEnter);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${isActive ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={field}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={element => setTitle(element.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
