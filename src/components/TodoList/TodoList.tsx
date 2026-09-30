import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';
import { EditingTodo } from '../../types/EditingTodo';

type Props = {
  todos: Todo[];
  deletingTodoIds: number[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  editingTodo: EditingTodo | null;
  onEditTodo: (todo: Todo) => void;
  onEditTitleChange: (title: string) => void;
  onEditSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onEditBlur: () => void;
  onEditKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};
/* eslint-disable jsx-a11y/label-has-associated-control */
export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingTodoIds,
  onToggle,
  onEditTodo,
  editingTodo,
  onEditTitleChange,
  onEditSubmit,
  onEditBlur,
  onEditKeyUp,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={deletingTodoIds.includes(todo.id)}
        onDelete={onDelete}
        onToggle={onToggle}
        onEdit={onEditTodo}
        editingTodo={editingTodo}
        onEditTitleChange={onEditTitleChange}
        onEditSubmit={onEditSubmit}
        onEditBlur={onEditBlur}
        onEditKeyUp={onEditKeyUp}
      />
    ))}
  </section>
);
