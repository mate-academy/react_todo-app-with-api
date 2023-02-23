import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { addTodo } from '../../api/todos';
import { TodoPost } from '../../types/TodoPost';
import { UserContext } from '../../UserContext';

type Props = {
  activeTodosQuantity: number;
  showError: (errorType: ErrorType) => void;
  showTempTodo: (tempTodoTitle: string) => void;
  addNewTodo: (newTodo: Todo) => void;
  toggleStatus: () => void;
};

export const Header: React.FC<Props> = React.memo(({
  activeTodosQuantity,
  showError,
  showTempTodo,
  addNewTodo,
  toggleStatus,
}) => {
  const [newTodoName, setNewTodoName] = useState('');
  const [isInvalidInput, setIsInvalidInput] = useState(false);

  const userId = useContext(UserContext);

  const handleAddNewTodo = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const title = newTodoName.trim();

    if (!title) {
      showError(ErrorType.EmptyTitle);

      return;
    }

    const newTodo: TodoPost = {
      userId,
      title,
      completed: false,
    };

    try {
      const createdTodo = await addTodo(userId, newTodo);

      addNewTodo(createdTodo);
    } catch {
      showError(ErrorType.Add);
    } finally {
      showTempTodo('');
      setNewTodoName('');
      setIsInvalidInput(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: activeTodosQuantity,
        })}
        onClick={toggleStatus}
        aria-label="Toggle all todos"
      />

      <form onSubmit={handleAddNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoName}
          onChange={(event) => setNewTodoName(event.target.value)}
          disabled={isInvalidInput}
        />
      </form>
    </header>
  );
});
