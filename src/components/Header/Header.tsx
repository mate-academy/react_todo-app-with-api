import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onSubmit: ({ title, completed, userId }: Omit<Todo, 'id'>) => Promise<void>;
  onError: (error: string) => void;
  onErrorHidden: (errorShow: boolean) => void;
  onAddLoader: (value: boolean) => void;
  isAddLoader: boolean;
  IsLoadLoader: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  updateTodo: (updatedTodo: Todo) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  onSubmit,
  onError,
  onErrorHidden,
  onAddLoader,
  isAddLoader,
  IsLoadLoader,
  inputRef,
  updateTodo,
}) => {
  const [title, setTitle] = useState('');
  const checkCompleted = todos.every(todo => todo.completed);

  const handleToggleTodos = () => {
    setTodos((prev: Todo[]) =>
      prev.map(todo => {
        if (todo.completed !== !checkCompleted) {
          const updated = {
            ...todo,
            completed: !checkCompleted,
            isLoading: false,
          };

          updateTodo(updated);

          return updated;
        }

        return todo;
      }),
    );
  };

  useEffect(() => {
    if (!isAddLoader) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddLoader]);

  return (
    <header className="todoapp__header">
      {!IsLoadLoader && todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: checkCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleTodos}
        />
      )}

      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          const cleanTitle = title.trim();

          if (cleanTitle !== '') {
            onAddLoader(true);
            onSubmit({
              title: cleanTitle,
              completed: false,
              userId: USER_ID,
            })
              .then(() => setTitle(''))
              .catch(() => {})
              .finally(() => {
                onAddLoader(false);
              });
          } else {
            onError(ErrorMessage.emptyTitleError);
            onErrorHidden(false);
          }
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          disabled={isAddLoader}
        />
      </form>
    </header>
  );
};
