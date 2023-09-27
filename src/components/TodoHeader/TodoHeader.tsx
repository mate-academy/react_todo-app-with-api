import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodosCount: number,
  onSubmit: (todo: Todo) => void,
  todo?: Todo | null,
  userId: number,
  isLoading: boolean,
  errorMessage: string,
  request: boolean;
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
  // tempTodo,
  errorMessage,
  setErrorMessage,
  request,
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
  }, [activeTodosCount, request]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    setTitle(newTitle);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage('');

    if (!title.trimStart()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const id = todo?.id || 0;
    const tempTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      completed: false,
      userId,
    };

    onSubmit({ id, ...tempTodo });
  };

  return (
    <header className="todoapp__header">
      {/* {Boolean(todos.lenght) && ( */}
      <button
        type="button"
        aria-label="text"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
      {/* )} */}

      <form
        onSubmit={handleSubmit}
      >
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
          disabled={request}
        />

      </form>
    </header>
  );
};
