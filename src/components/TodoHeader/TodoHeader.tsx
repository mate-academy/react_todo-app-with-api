import React, { useState } from 'react';
import cn from 'classnames';
import { TodoStatistics } from '../../types/TodoStatistics';
import { verifyTitle } from '../../utils/verifyTitle';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';

type Props = {
  todoStatistics: TodoStatistics;
  onToggleClick: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isSaving: boolean;
  addTodo: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  handleErrorMessage: (test: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todoStatistics,
  onToggleClick,
  inputRef,
  isSaving,
  addTodo,
  handleErrorMessage,
}) => {
  const [title, setTitle] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAddSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const isValidTitle = verifyTitle(title);

    if (!isValidTitle) {
      handleErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      title: title.trim(),
      userId: todoService.USER_ID,
      completed: false,
    };

    addTodo(newTodo).then(() => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      {todoStatistics.all > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todoStatistics.all === todoStatistics.completed,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleClick}
        />
      )}

      <form onSubmit={handleAddSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
          disabled={isSaving}
        />
      </form>
    </header>
  );
};
