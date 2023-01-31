import React, { memo, useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  showError: (text: string) => void,
  isAddingTodo: boolean,
  onAddTodo: (fieldsForCreate: Omit<Todo, 'id'>) => void;
  shouldRenderActiveToggle: boolean;
  handleToggleTodosStatus: () => void;
};

export const Header: React.FC<Props> = memo((
  {
    newTodoField,
    showError,
    isAddingTodo,
    onAddTodo,
    shouldRenderActiveToggle,
    handleToggleTodosStatus,
  },
) => {
  const user = useContext(AuthContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoTitle.trim().length === 0) {
      showError('Title can\'t be empty');

      return;
    }

    if (!user) {
      showError('User not found');

      return;
    }

    try {
      await onAddTodo({
        title: newTodoTitle,
        userId: user.id,
        completed: false,
      });

      setNewTodoTitle('');
    } catch {
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={
          cn('todoapp__toggle-all', { active: shouldRenderActiveToggle })
        }
        onClick={handleToggleTodosStatus}
      />

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          disabled={isAddingTodo}
          value={newTodoTitle}
          onChange={handleTodoTitle}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
