import classNames from 'classnames';
import React, { useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';
import { addTodos } from '../../api/todos';
import { USER_ID } from '../../types/ConstantTypes';
import { TodoPost } from '../../types/TodoPost';

type Props = {
  counterActiveTodos: number;
  showError: (errorType: ErrorMessage) => void;
  hideError: () => void;
  onAddQuery: (newTitle: string) => void;
  addNewTodo: (newTodo: Todo) => void;
  onToggleTodosStatus: () => void;
};

export const Header: React.FC<Props> = React.memo(({
  counterActiveTodos,
  showError,
  hideError,
  onAddQuery,
  addNewTodo,
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
      showError(ErrorMessage.EmptyTitle);

      return;
    }

    hideError();
    onAddQuery(title);

    setHasInputDisabled(true);

    const newTodo: TodoPost = {
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    try {
      const createdTodo = await addTodos(newTodo);

      addNewTodo(createdTodo);
    } catch {
      showError(ErrorMessage.Add);
    } finally {
      onAddQuery('');
      setNewTodoTitle('');
      setHasInputDisabled(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !counterActiveTodos,
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
