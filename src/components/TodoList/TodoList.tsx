import React, { memo } from 'react';
import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export type Props = {
  todos: Todo[]
  deletedTodo: (todoId: number) => void
  temporaryTodo: Todo | null
  deletingTodoIds: number[]
  onUpdatingTodo: (todoId: Todo) => void
  updatingTodoIds: number[]
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  deletedTodo,
  temporaryTodo,
  deletingTodoIds,
  onUpdatingTodo,
  updatingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deletedTodo={deletedTodo}
          deletingTodoIds={deletingTodoIds}
          onUpdatingTodo={onUpdatingTodo}
          updatingTodoIds={updatingTodoIds}
        />
      ))}
      {temporaryTodo
        && (
          <TodoItem
            todo={temporaryTodo}
            key={temporaryTodo.id}
            deletedTodo={deletedTodo}
            deletingTodoIds={deletingTodoIds}
            onUpdatingTodo={onUpdatingTodo}
            updatingTodoIds={updatingTodoIds}
          />
        )}
    </section>
  );
});
