import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  updateTodo: (todo: Todo) => void,
  updatingTodo: Todo | undefined,
  deletingTodo: Todo | undefined,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  deleteTodo,
  updateTodo,
  updatingTodo,
  deletingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          updatingTodo={updatingTodo}
          deletingTodo={deletingTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          updatingTodo={updatingTodo}
          deletingTodo={deletingTodo}
        />
      )}
    </section>
  );
});
