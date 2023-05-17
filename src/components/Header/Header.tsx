import cn from 'classnames';
import React, { useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';
import { addTodos } from '../../api/todos';
import { USER_ID } from '../../types/ConstantTypes';
import { TodoPost } from '../../types/TodoPost';

type Props = {
  countActiveTodos: number;
  onShowError: (errorType: ErrorMessage) => void;
  onHideError: () => void;
  onChange: (newTitle: string) => void;
  onAddTodo: (newTodo: Todo) => void;
  onToggleTodosStatus: () => void;
};

export const Header: React.FC<Props> = React.memo(({
  countActiveTodos,
  onShowError,
  onHideError,
  onChange,
  onAddTodo,
  onToggleTodosStatus,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [hasInputDisabled, setHasInputDisabled] = useState(false);

  const handleAddNewTodo = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      onShowError(ErrorMessage.EmptyTitle);

      return;
    }

    onHideError();
    onChange(title);

    setHasInputDisabled(true);

    const newTodo: TodoPost = {
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    try {
      const createdTodo = await addTodos(newTodo);

      onAddTodo(createdTodo);
    } catch {
      onShowError(ErrorMessage.Add);
    } finally {
      onChange('');
      setNewTodoTitle('');
      setHasInputDisabled(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: !countActiveTodos,
        })}
        aria-label="Toggle all todos"
        onClick={onToggleTodosStatus}
      />

      <form onSubmit={handleAddNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={hasInputDisabled}
        />
      </form>
    </header>
  );
});
