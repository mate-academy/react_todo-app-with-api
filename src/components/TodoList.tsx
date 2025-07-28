import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[] | null;
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: boolean) => void;
  loadingTodoId: number | null;
  onTitleUpdate: (id: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onStatusUpdate,
  loadingTodoId,
  onTitleUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          onStatusUpdate={onStatusUpdate}
          isLoading={loadingTodoId === todo.id}
          onTitleUpdate={onTitleUpdate}
        />
      ))}
    </section>
  );
};
