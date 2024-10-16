import React from 'react';
import { Todo } from '../todo';
import { Todo as TodoType } from '../../types/Todo';

type Props = {
  todos: TodoType[];
  loadingTodos: number[];
  tempTodo: TodoType | null;
  handleDelete: (todoId: number) => void;
  handleToggleTodo: (id: number, currentStatus: boolean) => void;
  handleTitleUpdate: (id: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodos,
  tempTodo,
  handleDelete,
  handleToggleTodo,
  handleTitleUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          loadingTodos={loadingTodos}
          handleToggleTodo={handleToggleTodo}
          handleTitleUpdate={handleTitleUpdate}
        />
      ))}
      {tempTodo && (
        <Todo
          todo={tempTodo}
          loadingTodos={loadingTodos}
          handleDelete={handleDelete}
          handleToggleTodo={handleToggleTodo}
          handleTitleUpdate={handleTitleUpdate}
        />
      )}
    </section>
  );
};
