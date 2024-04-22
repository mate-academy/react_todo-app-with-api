import React from 'react';

import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { Filter } from '../Filter/Filter';
import { Errors } from '../../types/Errors';

type Props = {
  onFilterChange: (value: Status) => void;
  currentFilterStatus: Status;
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<unknown>;
  setError: (error: Errors) => void;
};

export const Footer: React.FC<Props> = ({
  onFilterChange,
  currentFilterStatus,
  todos,
  onDeleteTodo,
  setError,
}) => {
  const uncompletedTodos = todos.filter(item => !item.completed);

  const isAnyTodoCompleted = todos.some(todo => todo.completed);

  async function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map(todo => onDeleteTodo(todo.id)));
    } catch {
      setError(Errors.Delete);
    }
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodos.length} items left`}
      </span>

      <Filter
        onFilter={onFilterChange}
        currentFilterStatus={currentFilterStatus}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyTodoCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
