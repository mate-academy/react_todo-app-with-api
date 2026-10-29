import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoUpdate: (todo: Todo) => Promise<void>;
  loadingTodoIds: number[];
};

export const TodoList = React.memo(
  ({ todos, onTodoDelete, onTodoUpdate, loadingTodoIds }: Props) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            onTodoDelete={onTodoDelete}
            onTodoUpdate={onTodoUpdate}
            loading={loadingTodoIds.includes(todo.id)}
          />
        ))}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
