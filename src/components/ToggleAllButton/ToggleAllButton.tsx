import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../contexts/TodosContext';

export const ToggleAllButton:React.FC = () => {
  const { todos, activeTodos, updateTodo } = useContext(TodosContext);

  const hasActiveTodos = activeTodos.length > 0;

  const toggleAllActiveTodos = () => {
    Promise.all([todos.map(
      todo => updateTodo && updateTodo({
        ...todo,
        completed: hasActiveTodos,
      }),
    )]);
  };

  return (
    <button
      type="button"
      className={classNames(
        'todoapp__toggle-all',
        { active: !hasActiveTodos },
      )}
      data-cy="ToggleAllButton"
      aria-label="Add New Todo"
      onClick={toggleAllActiveTodos}
    />
  );
};
