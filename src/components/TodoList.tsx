import React, { useEffect } from 'react';
import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';
import { preparedTodos } from '../utils/preparedTodos';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  filter: FilterTypes;
  tempTodo: Todo | null;
  changeErrorText: (error: string) => void;
  isUpdating: boolean;
  handleIsUpdating: (status: boolean) => void;
  updatingIds: number[];
  handleUpdatingIds: (ids: number[]) => void;
  loadTodos: () => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  tempTodo,
  changeErrorText,
  isUpdating,
  handleIsUpdating,
  updatingIds,
  handleUpdatingIds,
  loadTodos,
}) => {
  const filteredTodos = preparedTodos(todos, filter);

  useEffect(() => {
    loadTodos();
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
          changeErrorText={changeErrorText}
          loadTodos={loadTodos}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isUpdating={isUpdating}
          updatingIds={updatingIds}
          handleIsUpdating={handleIsUpdating}
          handleUpdatingIds={handleUpdatingIds}
          changeErrorText={changeErrorText}
          loadTodos={loadTodos}
        />
      )}
    </section>
  );
};
