import React, { useMemo } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { LoadType } from '../../types/LoadType';

type Props = {
  todos: Todo[];
  typeOfLoad: LoadType;
  tempTodo?: Todo | null,
  onDelete: (id: number) => void,
  loadId: number[],
  handleEdit: (id: number, data: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  typeOfLoad,
  tempTodo,
  onDelete,
  loadId,
  handleEdit,
}) => {
  const visibleTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (typeOfLoad) {
      case LoadType.Active:
        return !completed;

      case LoadType.Completed:
        return completed;

      default:
        return true;
    }
  }), [typeOfLoad, todos]);

  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo) => {
        const isLoad = loadId.some(el => el === todo.id);

        return (
          <TodoItem
            todo={todo}
            onDelete={onDelete}
            isLoad={isLoad}
            handleEdit={handleEdit}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoad
          onDelete={() => {}}
          handleEdit={() => {}}
        />
      )}
    </section>
  );
};
