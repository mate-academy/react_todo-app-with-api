import cn from 'classnames';
import { Todo } from '../types/Todo';
import React, { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  onErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: ({ userId, title, completed }: Omit<Todo, 'id'>) => Promise<void>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  todosInProcess: number[];
  updateTodo: (
    todoId: number,
    newTitle: string,
    completed?: boolean,
  ) => Promise<void> | undefined;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const Header: React.FC<Props> = ({
  todos,
  onErrorMessage,
  onSubmit,
  setTempTodo,
  todosInProcess,
  updateTodo,
  newTodoTitle,
  setNewTodoTitle,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos, isSubmitting]);

  const allChecked = todos.every(todo => todo.completed);

  const handleNewTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      onErrorMessage('Title should not be empty');
      setTimeout(() => onErrorMessage(''), 3000);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    onSubmit({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newCompletedStatus = !allCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    todosToUpdate.forEach(todo => {
      updateTodo(todo.id, todo.title, newCompletedStatus);
    });
  };

  const shouldShowToggleAllButton = !!todos.length && !todosInProcess.length;

  return (
    <header className="todoapp__header">
      {shouldShowToggleAllButton && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allChecked })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          disabled={isSubmitting}
          value={newTodoTitle}
          onChange={handleNewTodoTitle}
        />
      </form>
    </header>
  );
};
