import { useState } from 'react';

import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../enums/ErrorMessages';
import { USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  onAdd: (title: string) => void;
  onAddError: (error: ErrorMessage) => void;
  isDisabled: boolean;
  toggleAllCompleted: () => void;
  onTempTodo: (todo: Todo) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onAdd,
  onAddError,
  isDisabled,
  toggleAllCompleted,
  onTempTodo,
}) => {
  const [newTodo, setNewTodo] = useState('');

  const handleChange = (e: React.BaseSyntheticEvent) => {
    setNewTodo(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const todo = {
      title: newTodo,
      userId: USER_ID,
      completed: false,
    };

    onTempTodo(({
      id: 0,
      ...todo,
    }));

    if (!newTodo.trim()) {
      onAddError(ErrorMessage.TITLE);
      setNewTodo('');

      return;
    }

    onAdd(newTodo);
    setNewTodo('');
  };

  const hasActive = todos.some(todo => !todo.completed);

  return (
    <header className="todoapp__header">
      {hasActive && (
        <button
          aria-label="none"
          type="button"
          className="todoapp__toggle-all active"
          onClick={toggleAllCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleChange}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
