import React, { useContext } from 'react';
import { TodosContext } from '../context/TodosContext';

export const ClearButton: React.FC = () => {
  const {
    todos,
    handleClearCompleted,
  } = useContext(TodosContext);
  const areCompletedExist = todos.filter(todo => todo.completed).length > 0;

  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={handleClearCompleted}
      disabled={!areCompletedExist}
    >
      Clear completed
    </button>
  );
};
