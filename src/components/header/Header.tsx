/* eslint-disable jsx-a11y/control-has-associated-label */

// -------------------------- IMPORT ---------------------------------
import React, { useContext } from 'react';
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

  const handleToggleAll = () => {
    const activeTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    const isActiveInList = activeTodos.length === 0;

    const changedTodo = isActiveInList ? completedTodos : activeTodos;

    changedTodo.forEach((todo) => {
      const newTodo = {
        ...todo,
        completed: !todo.completed,
      };

      onUpdate(newTodo);
    });
  };

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
