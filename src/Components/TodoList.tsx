import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  deleteTodo: (todoId: number) => Promise<void>;
  toggleTodo: (todo: Todo) => void;
  editedTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  toggleTodo,
  editedTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          editedTodo={editedTodo}
        />
      ))}
    </section>
  );
};
