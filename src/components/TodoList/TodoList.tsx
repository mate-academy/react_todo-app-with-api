import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  onDelete: (todoId: number) => Promise<void>,
  activeTodoId: number[],
  onUpdateTodoStatus: (todoId: number, todo: Partial<Todo>) => Promise<void>
  onDeleteTodo: (todoId: number) => Promise<void>
}

export const Todolist: React.FC<Props> = React.memo(({
  todos,
  onDelete,
  activeTodoId,
  onUpdateTodoStatus,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          activeTodoId={activeTodoId}
          onUpdateTodoStatus={onUpdateTodoStatus}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </section>
  );
});
