/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { memo, useContext, useState } from 'react';
import cn from 'classnames';
import { ErorrMessage } from '../../types/enums';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todosList: Todo[],
  onSubmit: (todoData: Omit<Todo, 'id'>) => void,
  newTodoField: React.RefObject<HTMLInputElement>,
  setIsError: (value: boolean) => void,
  setErrorText: (value: string) => void,
  isAdding: boolean,
  updateTodo: (
    todoId: number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => void,
};

export const Header: React.FC<Props> = memo(({
  todosList,
  newTodoField,
  onSubmit,
  setIsError,
  setErrorText,
  isAdding,
  updateTodo,
}) => {
  const [title, setTitle] = useState('');
  const user = useContext(AuthContext);

  const uncompletedTodo = todosList.filter(todo => todo.completed === false);

  const toggleAlltodos = () => {
    if (!uncompletedTodo.length) {
      todosList.map(todo => {
        return updateTodo(todo.id, { completed: false });
      });
    }

    todosList.forEach(todo => {
      if (todo.completed === false) {
        updateTodo(todo.id, { completed: true });
      }
    });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const IsValidTitle = title.trim().length > 0;

    if (!IsValidTitle) {
      setIsError(true);
      setErrorText(ErorrMessage.UNVALID_TITLE);

      return;
    }

    if (!user) {
      return;
    }

    onSubmit({
      userId: user.id,
      title,
      completed: false,
    });

    setTitle(() => '');
  };

  return (
    <header className="todoapp__header">
      {todosList.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: false,
          })}
          onClick={toggleAlltodos}
        />
      )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={(event) => {
            setIsError(false);
            setTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
});
