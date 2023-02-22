import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { addTodo } from '../../api/todos';
import { AddTodo } from '../../types/AddTodo';
import { UserContext } from '../../UserContext';

type Props = {
  activeTodosAmount: number;
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
  showTempTodo: (tempTodoTitle: string) => void;
  addNewTodo: (newTodo: Todo) => void;
  toggleStatus: () => void;
};

export const Header: React.FC<Props> = React.memo(({
  activeTodosAmount,
  showError,
  hideError,
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

    hideError();
    showTempTodo(title);
    setIsInvalidInput(true);

    const newTodo: AddTodo = {
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
          active: activeTodosAmount,
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
