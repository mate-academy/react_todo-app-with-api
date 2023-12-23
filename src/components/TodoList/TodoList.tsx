import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (todo: Todo) => void,
  handleToggleTodo: (id: number) => void,
  handleUpdateTodo: (todo: Todo) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  handleToggleTodo,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleTodo={handleToggleTodo}
          handleUpdateTodo={handleUpdateTodo}
          key={todo.id}
        />
      ))}
    </section>
  );
};
