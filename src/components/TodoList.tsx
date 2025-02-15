import { TodoItem } from './TodoItem';
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: (value: (current: Todo[]) => Todo[]) => void;
  handleError: (value: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  handleError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleError={handleError}
          setTodos={setTodos}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleError={handleError}
          setTodos={setTodos}
          loading={true}
        />
      )}
    </section>
  );
};
