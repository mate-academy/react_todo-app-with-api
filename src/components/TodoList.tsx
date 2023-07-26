import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  preparedTodos: Todo[],
  onDelete: (id: number) => void;
  tempTodo: Todo | null,
  updateTodo: (uTodo: Todo) => void,
  loadingTodoIds: number[]
};

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  onDelete = () => { },
  tempTodo,
  updateTodo = () => { },
  loadingTodoIds,
}) => {
  return (
    <>
      {preparedTodos?.map((todo) => {
        return (
          <TodoItem
            todo={todo}
            onDelete={onDelete}
            key={todo.id}
            updateTodo={updateTodo}
            loadingTodoIds={loadingTodoIds}
          />
        );
      })}
      {
        tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={onDelete}
            updateTodo={updateTodo}
            loadingTodoIds={loadingTodoIds}
          />
        )
      }
    </>
  );
};
