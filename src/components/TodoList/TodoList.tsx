import React from 'react';
import type { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

/* eslint-disable react/jsx-filename-extension */

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  handleToggle: (todoId: number) => void;
  onUpdate: (todoId: number, title: string) => Promise<void>;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  handleToggle,
  onUpdate,
  deletingTodoIds,
  updatingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={
            deletingTodoIds.includes(todo.id) ||
            updatingTodoIds.includes(todo.id)
          }
          onDelete={onDelete}
          toggleTodo={handleToggle}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};

export default TodoList;
