import React, { useState, useEffect } from 'react';
import { ErrorsEnum } from '../../enums/ErrorMessage';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID, createTodo } from '../../api/todos';

const createNewTodo = (title: string): Omit<Todo, 'id'> => {
  return { title, completed: false, userId: USER_ID };
};

type Props = {
  onAddTodo: (todo: Todo) => void;
  onTempTodoChange: (todo: Todo | null) => void;
  onToggleAll: () => void;
  onError: (message: string) => void;
  onClearError: () => void;
  hasTodos: boolean;
  isAllTodoCompleted: boolean;
  newTodoInputRef: React.RefObject<HTMLInputElement>;
};

const TodoFormComponent = ({
  onAddTodo,
  onTempTodoChange,
  onToggleAll,
  onError,
  onClearError,
  hasTodos,
  isAllTodoCompleted,
  newTodoInputRef,
}: Props) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      newTodoInputRef.current?.focus();
    }
  }, [isSubmitting, newTodoInputRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onClearError();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError(ErrorsEnum.TITLE);

      return;
    }

    setIsSubmitting(true);

    const newTodo = createNewTodo(trimmedTitle);

    onTempTodoChange({ ...newTodo, id: 0 });

    createTodo(newTodo)
      .then(todo => {
        onAddTodo(todo);
        setTitle('');
      })

      .catch(() => {
        onError(ErrorsEnum.ADD);
      })

      .finally(() => {
        setIsSubmitting(false);
        onTempTodoChange(null);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', isAllTodoCompleted && 'active')}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={newTodoInputRef}
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={isSubmitting}
      />
    </form>
  );
};

export const TodoForm = React.memo(TodoFormComponent);
