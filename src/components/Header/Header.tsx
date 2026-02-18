import { ErrorMessage, ERROR_MESSAGES } from '../../types/ErrorMessages';
import React, { useState } from 'react';
import { addTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { updateTodo } from '../../api/todos';

type HeaderProps = {
  onErrorMessage: (errorMessage: ErrorMessage) => void;
  onSetTempTodo: (todo: Todo | null) => void;
  onSetTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
  onProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  todos: Todo[];
  hasTodos: boolean;
  isAllCompleted: boolean;
  focusInput?: () => void;
};

export const Header = ({
  onErrorMessage,
  onSetTempTodo,
  onSetTodo,
  onProcessingIds,
  inputRef,
  focusInput,
  todos,
  hasTodos,
  isAllCompleted,
}: HeaderProps) => {
  const [titleValue, setTitleValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedTitle = titleValue.trim();

    if (!normalizedTitle) {
      onErrorMessage(ERROR_MESSAGES.EMPTY_TITLE);

      return;
    }

    onSetTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });
    onProcessingIds(prevIds => [...prevIds, 0]);
    setIsSubmitting(true);
    addTodo(normalizedTitle)
      .then(todo => {
        onSetTodo(prevTodos => [...prevTodos, todo]);
        setTitleValue('');
      })
      .catch(() => {
        onErrorMessage(ERROR_MESSAGES.ADD_FAIL);
      })
      .finally(() => {
        setIsSubmitting(false);
        onSetTempTodo(null);
        onProcessingIds(prevIds => prevIds.filter(id => id !== 0));
        setTimeout(() => inputRef.current?.focus());
      });
  };

  const handleToggleAll = () => {
    const nextCompleted = !isAllCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== nextCompleted,
    );
    const todosToUpdateIds = todosToUpdate.map(todo => todo.id);

    if (todosToUpdate.length === 0) {
      return;
    }

    onProcessingIds(prevState => [...prevState, ...todosToUpdateIds]);

    Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: nextCompleted }),
      ),
    )
      .then(results => {
        const hasRejected = results.some(
          result => result.status === 'rejected',
        );

        if (hasRejected) {
          onErrorMessage(ERROR_MESSAGES.UPDATE_FAIL);
        }

        const updatedTodos: Todo[] = [];

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            updatedTodos.push(result.value);
          }
        });

        onSetTodo(prevTodos =>
          prevTodos.map(todo => {
            const updated = updatedTodos.find(item => item.id === todo.id);

            return updated ?? todo;
          }),
        );
      })
      .finally(() => {
        onProcessingIds(prevState =>
          prevState.filter(id => !todosToUpdateIds.includes(id)),
        );
        focusInput?.();
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={titleValue}
          onChange={e => setTitleValue(e.target.value)}
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
