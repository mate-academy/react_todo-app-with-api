import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onClose(todoId: number[]): void;
  processedTodos: number[];
  onToggle(todoId: number[], completed: boolean): void;
  onChange(value: string, todoId: number): void
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    onClose,
    processedTodos,
    onToggle,
    onChange,
  }) => {
    return (
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <TodoItem
              todo={todo}
              onClose={onClose}
              processedTodos={processedTodos}
              onToggle={onToggle}
              onChange={onChange}
            />
          </li>
        ))}
      </ul>
    );
  },
);
