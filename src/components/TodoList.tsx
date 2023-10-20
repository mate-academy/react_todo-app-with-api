import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  isLoading: number[];
  tempTodo: Todo | null;
  handleEdit: (todo: Todo) => void;
  handleActiveTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isLoading,
  tempTodo,
  handleEdit,
  handleActiveTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          isLoading={isLoading.includes(todo.id)}
          handleEdit={handleEdit}
          activeTodo={handleActiveTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isLoading
          handleEdit={handleEdit}
          activeTodo={handleActiveTodo}
        />
      )}
    </section>
  );
};
