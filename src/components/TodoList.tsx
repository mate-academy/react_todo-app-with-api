import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[],
  onDelete: (id: number) => void,
  onStatusUpdate: (id: number, status: boolean) => void;
  onTitleUpdate: (id: number, title: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  onStatusUpdate,
  onTitleUpdate,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onStatusUpdate={onStatusUpdate}
          onTitleUpdate={onTitleUpdate}
        />
      ))}
    </>
  );
};
