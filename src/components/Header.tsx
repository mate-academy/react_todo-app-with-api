/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import * as todoService from './../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  activeTodosCount: Todo[];
  completedTodosCount: number;
  setErrorMessage: (e: string) => void;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isLoading: boolean;
  autoHideNotification: () => void;
  onAdd: (todo: Todo) => void;
  onToggleAll: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  setErrorMessage,
  isLoading,
  autoHideNotification,
  onAdd,
  onToggleAll,
  setTempTodo,
  inputRef,
}) => {
  const [valueTitle, setValueTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!valueTitle.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);
      autoHideNotification();
      inputRef.current?.focus();

      return;
    }

    const trimmedTitle = valueTitle.trim();
    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: todoService.USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      setIsSubmitting(true);

      const createdTodo = await todoService.createTodo({
        title: trimmedTitle,
        userId: newTodo.userId,
        completed: newTodo.completed,
      });

      onAdd(createdTodo);

      setValueTitle('');
      setTempTodo(null);
      inputRef.current?.focus();
    } catch (error) {
      setErrorMessage(ErrorMessage.AddTodo);
      autoHideNotification();
    } finally {
      setTempTodo(null);
      inputRef.current?.focus();
      setIsSubmitting(false);
    }
  };

  const hasTodos = activeTodosCount.length > 0 || completedTodosCount > 0;
  const shouldRender = hasTodos && !isLoading;

  return (
    <header className="todoapp__header">
      {shouldRender && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !activeTodosCount.length,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={valueTitle}
          onChange={e => setValueTitle(e.target.value)}
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
