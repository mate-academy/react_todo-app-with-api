import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodoItem } from './TempTodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  onToggle: (todoId: number) => void;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, newTitle: string) => void;
  updatingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoIds,
  onToggle,
  onDelete,
  onUpdate,
  updatingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          isUpdating={updatingTodoIds.includes(todo.id)}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && <TempTodoItem tempTodo={tempTodo} />}
    </section>
  );
};
