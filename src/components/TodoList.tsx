import React, { useEffect } from 'react';
import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';
import { preparedTodos } from '../utils/preparedTodos';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  filter: FilterTypes;
  tempTodo: Todo | null;
  handleError: (error: string) => void;
  isUpdating: boolean;
  handleIsUpdating: (status: boolean) => void;
  updatingIds: number[];
  handleUpdatingIds: (ids: number[]) => void;
  handleLoadTodos: () => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  tempTodo,
  handleError,
  isUpdating,
  handleIsUpdating,
  updatingIds,
  handleUpdatingIds,
  handleLoadTodos,
}) => {
  const filteredTodos = preparedTodos(todos, filter);

  useEffect(() => {
    handleLoadTodos();
  }, [isUpdating]);

  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isUpdating={isUpdating}
          updatingIds={updatingIds}
          handleIsUpdating={handleIsUpdating}
          handleUpdatingIds={handleUpdatingIds}
          handleError={handleError}
          handleLoadTodos={handleLoadTodos}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isUpdating={isUpdating}
          updatingIds={updatingIds}
          handleIsUpdating={handleIsUpdating}
          handleUpdatingIds={handleUpdatingIds}
          handleError={handleError}
          handleLoadTodos={handleLoadTodos}
        />
      )}
    </section>
  );
};
