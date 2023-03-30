import React, { useCallback } from 'react';
import { Todo } from '../../types/Todo';
import { TodoElement } from '../TodoElement';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[];
  tempTodo: Todo | undefined;
  onDelete: (id: number) => void;
  loadingIds: number[];
  onUpdateTodo: (id: number, data: Partial<Todo>) => void;
  filterType: FilterType;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingIds,
  onUpdateTodo,
  filterType,
}) => {
  const getTodos = useCallback((): Todo[] => {
    switch (filterType) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);

      case FilterType.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [filterType, todos]);

  const visibleTodos = getTodos();

  return (
    <>
      <section className="todoapp__main">
        {visibleTodos.map(todo => {
          const isLoading = loadingIds.some(id => id === todo.id);

          return (
            <TodoElement
              todo={todo}
              key={todo.id}
              onDelete={onDelete}
              isLoading={isLoading}
              onUpdateTodo={onUpdateTodo}
            />
          );
        })}
      </section>

      {tempTodo && (
        <TodoElement
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={() => {}}
          isLoading
          onUpdateTodo={() => {}}
        />
      )}
    </>
  );
};
