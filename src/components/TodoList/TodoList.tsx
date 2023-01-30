import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (todoId: number) => Promise<any>;
  deletingTodoIds: number[],
  updateTodo: (todo: Todo) => Promise<any>,
  updatingTodoIds: number[],
  showError: (message: string) => void,
  updateTodoTitle: (todo: Todo) => void,

};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  deletingTodoIds,
  updateTodo,
  updatingTodoIds,
  showError,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          updateTodo={updateTodo}
          isUpdating={updatingTodoIds.includes(todo.id)}
          showError={showError}
          updateTodoTitle={updateTodoTitle}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isDeleting={deletingTodoIds.includes(tempTodo.id)}
          updateTodo={updateTodo}
          isUpdating={updatingTodoIds.includes(tempTodo.id)}
          showError={showError}
          updateTodoTitle={updateTodoTitle}
        />
      )}
    </section>
  );
};
