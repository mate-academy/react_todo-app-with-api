import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { addTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoPost } from '../../types/TodoPost';
import { ErrorMessage } from '../../types/ErrorMessage';
import { UserIdContext } from '../../utils/context';

type Props = {
  counterActiveTodos: number;
  showError: (errorType: ErrorMessage) => void;
  hideError: () => void;
  showCreatingTodo: (creatingTodoTitle: string) => void;
  addNewTodo: (newTodo: Todo) => void;
  onToggleTodosStatus: () => void;
};

export const Header: React.FC<Props> = React.memo(({
  counterActiveTodos,
  showError,
  hideError,
  showCreatingTodo,
  addNewTodo,
  onToggleTodosStatus,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [hasInputDisabled, setHasInputDisabled] = useState(false);

  const userId = useContext(UserIdContext);

  const handleAddingNewTodo = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      showError(ErrorMessage.EmptyTitle);

      return;
    }

    hideError();
    showCreatingTodo(title);

    setHasInputDisabled(true);

    const newTodo: TodoPost = {
      userId,
      title,
      completed: false,
    };

    try {
      const createdTodo = await addTodos(userId, newTodo);

      addNewTodo(createdTodo);
    } catch {
      showError(ErrorMessage.Add);
    } finally {
      showCreatingTodo('');
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
        onClick={onToggleTodosStatus}
        aria-label="Toggle all todos"
      />

      <form onSubmit={handleAddingNewTodo}>
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
