import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  loadingTodoIds: number[],
  onTodoDelete: (todoId: number) => Promise<void>,
  onTodoStatusUpdate: (updatedTodo: Todo) => Promise<void>,
  onTodoTitleUpdate: (
    todo: Todo,
    newTitle: string
  ) => Promise<void>,
}

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onTodoDelete,
  onTodoStatusUpdate,
  onTodoTitleUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={async () => onTodoDelete(todo.id)}
          isLoading={loadingTodoIds.includes(todo.id)}
          onStatusUpdate={async () => onTodoStatusUpdate(todo)}
          onTitleUpdate={onTodoTitleUpdate}
        />
      ))}
    </section>
  );
};
