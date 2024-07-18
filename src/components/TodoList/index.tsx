import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingCompleted: boolean;
  loadingIds: number[];
  handleUpdate: (todo: Todo) => Promise<boolean>;
  onDeleteTodo: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingCompleted,
  loadingIds,
  handleUpdate,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deletingCompleted={deletingCompleted}
          loadingIds={loadingIds}
          handleUpdate={handleUpdate}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deletingCompleted={deletingCompleted}
          loadingIds={loadingIds}
          handleUpdate={handleUpdate}
          onDeleteTodo={onDeleteTodo}
        />
      )}
    </section>
  );
};
