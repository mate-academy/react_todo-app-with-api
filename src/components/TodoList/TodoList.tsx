import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  onDelete: (todoId: number) => Promise<void>,
  activeTodoId: number[],
  onUpdateTodoStatus: (todoId: number, todo: Partial<Todo>) => Promise<void>,
  onDeleteTodo: (todoId: number) => Promise<void>,
  isAdding: boolean,
}

export const Todolist: React.FC<Props> = React.memo(({
  todos,
  onDelete,
  activeTodoId,
  onUpdateTodoStatus,
  onDeleteTodo,
  isAdding,
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
          isAdding={isAdding}
          key={todo.id}
        />
      ))}
    </section>
  );
});
