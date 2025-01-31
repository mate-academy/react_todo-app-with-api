import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (postId: number) => void;
  deletingTodoIds?: number[] | null;
  updatingTodoIds?: number[] | null;
  tempTodo: Todo | null;
  updateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  deletingTodoIds,
  updatingTodoIds,
  tempTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          loading={
            deletingTodoIds?.includes(todo.id) ||
            updatingTodoIds?.includes(todo.id)
          }
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} deleteTodo={deleteTodo} loading />}
    </section>
  );
};
