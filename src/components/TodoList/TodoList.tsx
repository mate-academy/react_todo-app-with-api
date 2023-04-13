import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoElement } from '../newTodo/TodoElement';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingIds: number[]
  statusChange: (id: number, data: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onDelete,
  statusChange,
}) => {
  return (
    <>
      {todos.map(todo => {
        const isLoading = loadingIds.some(id => id === todo.id);

        return (
          <TodoElement
            todo={todo}
            key={todo.id}
            onDelete={() => onDelete(todo.id)}
            isLoading={isLoading}
            statusChange={statusChange}
          />
        );
      })}

      {tempTodo && (
        <TodoElement
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={() => onDelete(tempTodo.id)}
          isLoading
          statusChange={statusChange}
        />
      )}
    </>
  );
};
