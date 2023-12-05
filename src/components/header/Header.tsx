/* eslint-disable jsx-a11y/control-has-associated-label */

// -------------------------- IMPORT ---------------------------------
import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';
import { TodoForm } from '../todoForm/TodoForm';
// -------------------------------------------------------------------

type Props = {
  onAdd: (val: string) => void,
  onUpdate: (val: Todo) => void,
};

export const Header: React.FC<Props> = ({
  onAdd,
  onUpdate,
}) => {
  const {
    todos,
  } = useContext(TodosContext);

  const handleToggleAll = useCallback(() => {
    const activeTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    const isActiveInList = activeTodos.length === 0;

    const changedTodo = isActiveInList ? completedTodos : activeTodos;

    Promise.all(
      changedTodo.map((todo) => {
        const newTodo = {
          ...todo,
          completed: !todo.completed,
        };

        return onUpdate(newTodo);
      }),
    );
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every((todo) => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <TodoForm
        onAdd={onAdd}
      />
    </header>
  );
};
