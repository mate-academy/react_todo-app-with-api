import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  currentId: number | null,
  handleDeleteTodo: (todo: Todo) => void,
  handleUpdateTodo: (todo: Todo) => Promise<void>,
}

export const TodoList: React.FC<Props> = ({
  todos,
  currentId,
  handleUpdateTodo,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          currentId={currentId}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
        />
      ))}
    </section>
  );
};
