import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  deleteTodo: (id: number) => void,
  loading: number[],
  tempTodo: Todo | null,
  updateTodo: (todo: Todo) => void,
  changeErrorMessage: (message: string) => void,
}

export const TodosList: React.FC<Props> = ({
  todos,
  deleteTodo,
  loading,
  tempTodo,
  updateTodo,
  changeErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          isLoading={loading}
          updateTodo={updateTodo}
          changeErrorMessage={changeErrorMessage}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isLoading={loading}
          updateTodo={updateTodo}
          changeErrorMessage={changeErrorMessage}
        />
      )}
    </section>
  );
};
