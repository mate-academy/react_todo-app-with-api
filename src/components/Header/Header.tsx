import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { USER_ID } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[];
  setErrorMessage: Dispatch<SetStateAction<ErrorMessage | null>>;
  handleCreateTodo: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  isLoading: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setErrorMessage,
  handleCreateTodo,
  isLoading,
  onToggleAll,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeButton = todos.length > 0 && todos.every(todo => todo.completed);
  const focusInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusInput.current && !isLoading) {
      focusInput.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.TitleNotEmpty);

      return;
    }

    setIsSubmitting(true);

    try {
      await handleCreateTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTitle('');
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
      if (focusInput.current) {
        focusInput.current.focus();
      }
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: activeButton,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={focusInput}
          value={title}
          onChange={handleTitleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
