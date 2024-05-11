import React from 'react';
import { TodoInfo } from './TodoInfo';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  toggleTodo: (todoId: number, newStatus: boolean) => void;
  onChange: (todoId: number, newTodoTitle: string) => void;
  error: 'load' | 'add' | 'delete' | 'update' | 'empty' | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  toggleTodo,
  onChange,
  error,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          toggleTodo={toggleTodo}
          onChange={onChange}
          error={error}
        />
      ))}
    </section>
  );
};
