import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  isUpdating: number[];
  updateTodo: (todo: Todo) => void;
  removeTodo: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  isUpdating,
  updateTodo = () => {},
  removeTodo = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          isUpdating={isUpdating}
          updateTodo={updateTodo}
          removeTodo={removeTodo}
          key={todo.id}
        />
      ))}
    </section>
  );
};
