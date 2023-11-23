import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
  updateTodo: (todo: Todo) => void,
  updatingTodo: Todo | undefined,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  onDelete,
  updateTodo,
  updatingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          updateTodo={updateTodo}
          updatingTodo={updatingTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={onDelete}
          updateTodo={updateTodo}
          updatingTodo={updatingTodo}
        />
      )}
    </section>
  );
});
