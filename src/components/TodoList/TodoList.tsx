import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteTodoId: (todoId: number) => Promise<any>;
  deletingTodos: number[];
  onUpdateTodo: (
    changedTodo: Todo
    // todoId: number,
    // updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
  updatingTodos: number[];
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  tempTodo,
  deleteTodoId,
  deletingTodos,
  onUpdateTodo,
  updatingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodoId={deleteTodoId}
          shouldShowLoader={
            deletingTodos.includes(todo.id)
            || updatingTodos.includes(todo.id)
          }
          onUpdateTodo={onUpdateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodoId={deleteTodoId}
          shouldShowLoader={deletingTodos.includes(tempTodo.id)}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
});
