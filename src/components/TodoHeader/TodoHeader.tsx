import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../utils/errorMessage';

type Props = {
  activeTodosCount: number,
  onSubmit: (todo: Todo) => void,
  todo?: Todo | null,
  userId: number,
  isLoading: boolean,
  errorMessage: string,
  setErrorMessage: (errorMessage: string) => void,
  title: string;
  setTitle: (title: string) => void,
  isAllCompleted: boolean;
  onToggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  activeTodosCount,
  onSubmit,
  todo,
  userId,
  isLoading,
  errorMessage,
  setErrorMessage,
  title,
  setTitle,
  isAllCompleted,
  onToggleAll,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeTodosCount, isLoading]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    setTitle(newTitle);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage('');

    if (!title.trimStart()) {
      setErrorMessage(ErrorMessages.EmptyTitleError);

      return;
    }

    const newTodo: Todo = {
      id: todo?.id || 0,
      title: title.trim(),
      completed: false,
      userId,
    };

    onSubmit(newTodo);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="text"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className={classNames('todoapp__new-todo', {
            'is-danger': errorMessage,
          })}
          placeholder="What needs to be done?"
          onChange={(event) => {
            handleTitleChange(event);
          }}
          value={title}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
