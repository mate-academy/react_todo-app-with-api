import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import React from 'react';

interface Props {
  onTodosToDelete: React.Dispatch<React.SetStateAction<number[]>>;
  onUpdate: (data: Todo) => Promise<void>;
  todosToDelete: number[];
  tempTodo: Todo | null;
  todos: Todo[];
}

export const TodoList: React.FC<Props> = ({
  onTodosToDelete,
  onUpdate,
  tempTodo,
  todos,
  todosToDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          onTodosToDelete={onTodosToDelete}
          onUpdate={onUpdate}
          key={todo.id}
          todo={todo}
          todosToDelete={todosToDelete}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onTodosToDelete={onTodosToDelete}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};
