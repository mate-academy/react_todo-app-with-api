import React from 'react';

import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: number[];
  handleRemoveTodo: (id: number) => void;
  handleToggleTodoStatus: (todo: Todo) => void;
  handleUpdateTodoTitle: (todo: Todo, title: string) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodos,
  handleRemoveTodo,
  handleToggleTodoStatus,
  handleUpdateTodoTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingTodos={loadingTodos}
          handleRemoveTodo={handleRemoveTodo}
          handleToggleTodoStatus={handleToggleTodoStatus}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleRemoveTodo={handleRemoveTodo}
          loadingTodos={loadingTodos}
          handleToggleTodoStatus={handleToggleTodoStatus}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
        />
      )}
    </section>
  );
};
