import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { UserIdContext } from '../../utils/context';
import { Todo } from '../../types/Todo';
import { createTodo } from '../../api/todos';
import { ErrorTypes } from '../../types/PossibleError';
import { TodoPost } from '../../types/TodoPost';

type Props = {
  activeTodosQuantity: number;
  showTempTodo: (tempTodoTilte: string) => void;
  addNewTodo: (newTodo: Todo) => void;
  showError: (possibleError: ErrorTypes) => void;
  toggleStatus: () => void;
};

export const Header: React.FC<Props> = React.memo(({
  activeTodosQuantity,
  showTempTodo,
  addNewTodo,
  showError,
  toggleStatus,
}) => {
  const [newTodoName, setNewTodoName] = useState('');
  const [isInputIncorrect, setIsInputIncorrect] = useState(false);

  const userId = useContext(UserIdContext);

  const handleAddNewTodo = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const title = newTodoName.trim();

    if (!title) {
      showError(ErrorTypes.EmptyTitle);

      return;
    }

    const newTodo: TodoPost = {
      userId,
      title,
      completed: false,
    };

    try {
      const createdTodo = await createTodo(userId, newTodo);

      addNewTodo(createdTodo);
    } catch {
      showError(ErrorTypes.Add);
    } finally {
      showTempTodo('');
      setNewTodoName('');
      setIsInputIncorrect(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !activeTodosQuantity,
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
          disabled={isInputIncorrect}
        />
      </form>
    </header>
  );
});
