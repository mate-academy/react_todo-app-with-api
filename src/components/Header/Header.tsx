import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { UserIdContext } from '../../utils/context';
import { Todo } from '../../types/Todo';
import { createTodo } from '../../api/todos';
import { PossibleError } from '../../types/PossibleError';
import { TodoPost } from '../../types/TodoPost';

type Props = {
  activeTodosLength: number;
  showTempTodo: (tempTodoTilte: string) => void;
  createNewTodo: (newTodo: Todo) => void;
  showError: (possibleError: PossibleError) => void;
  hideError: () => void;
  toggleStatus: () => void;
};

export const Header: React.FC<Props> = ({
  activeTodosLength,
  showTempTodo,
  createNewTodo,
  showError,
  hideError,
  toggleStatus,
}) => {
  const [newTodoName, setNewTodoName] = useState('');
  const [isInputIncorrect, setIsInputIncorrect] = useState(false);

  const userId = useContext(UserIdContext);

  const handleCreateNewTodo = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const title = newTodoName.trim();

    if (!title) {
      showError(PossibleError.EmptyTitle);

      return;
    }

    hideError();
    showTempTodo(title);

    setIsInputIncorrect(true);

    const newTodo: TodoPost = {
      userId,
      title,
      completed: false,
    };

    try {
      const createdTodo = await createTodo(userId, newTodo);

      createNewTodo(createdTodo);
    } catch {
      showError(PossibleError.Add);
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
          active: !activeTodosLength,
        })}
        onClick={toggleStatus}
        aria-label="Toggle all todos"
      />

      <form onSubmit={handleCreateNewTodo}>
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
};
