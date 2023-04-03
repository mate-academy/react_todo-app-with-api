import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (todo: Todo) => void
  tempTodo: Todo | null;
  completedTodos: Todo[];
  updateTodoStatus: (isCompleted: boolean, todo: Todo) => void;
  updateTodoTitle: (title: string, todo: Todo) => void;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  removeTodo,
  completedTodos,
  updateTodoStatus,
  updateTodoTitle,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          updateTodoStatus={updateTodoStatus}
          updateTodoTitle={updateTodoTitle}
          tempTodoId={completedTodos.includes(todo)
            || (tempTodo?.id === todo.id)
            ? todo.id
            : null}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}
      {tempTodo?.id === 0 && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          tempTodoId={tempTodo.id}
          updateTodoStatus={updateTodoStatus}
          updateTodoTitle={updateTodoTitle}
          isLoading
        />
      )}
    </section>
  );
});
