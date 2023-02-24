/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm';

type Props = {
  title: string,
  todos: Todo[],
  handleInput: (input: string) => void,
  handleAddTodo: (todoTitle: string) => void,
  isTitleDisabled: boolean,
  handleAllTodosStatus: () => void,
};

export const Header: React.FC<Props> = ({
  title,
  todos,
  handleInput,
  handleAddTodo,
  isTitleDisabled,
  handleAllTodosStatus,
}) => {
  const activeTodos = useMemo(() => {
    return todos.some(todo => !todo.completed);
  }, [todos]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all', {
              active: !activeTodos,
            },
          )}
          onClick={handleAllTodosStatus}
        />
      )}

      <TodoForm
        title={title}
        handleInput={handleInput}
        handleAddTodo={handleAddTodo}
        isTitleDisabled={isTitleDisabled}
      />
    </header>
  );
};
