/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  tmpTodo: Omit<Todo, 'userId'> | null;
  updatedTodosId: number[];
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdateTitle: (id: number, newTitle: string) => void;
  failedTitleUpdateId: number;
  onSetFailedTitleUpdateId: (id: number) => void;
  onRemoveEmptyTodo: (id: number) => void;
};

export const TodosList = ({
  todos,
  tmpTodo,
  updatedTodosId,
  onRemove,
  onToggle,
  onUpdateTitle,
  failedTitleUpdateId,
  onSetFailedTitleUpdateId,
  onRemoveEmptyTodo,
}: TodoListProps) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}

      {todos.map(({ id, completed, title }) => (
        <TodoItem
          id={id}
          completed={completed}
          title={title}
          key={id}
          updatedTodosId={updatedTodosId}
          onRemove={onRemove}
          onToggle={onToggle}
          onUpdateTitle={onUpdateTitle}
          failedTitleUpdateId={failedTitleUpdateId}
          onSetFailedTitleUpdateId={onSetFailedTitleUpdateId}
          onRemoveEmptyTodo={onRemoveEmptyTodo}
        />
      ))}
      {tmpTodo && (
        <TodoItem
          id={tmpTodo.id}
          completed={tmpTodo.completed}
          title={tmpTodo.title}
          updatedTodosId={[]}
          onRemove={onRemove}
          onToggle={onToggle}
          onUpdateTitle={onUpdateTitle}
          failedTitleUpdateId={failedTitleUpdateId}
          onSetFailedTitleUpdateId={onSetFailedTitleUpdateId}
          onRemoveEmptyTodo={onRemoveEmptyTodo}
        />
      )}
    </section>
  );
};
