import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deletingTodoIds: number[];
  togglingTodoIds: number[];
  updatingTodoIds: number[];
  addingTodoId?: number;
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: number, completed: boolean) => void;
  onUpdateTitle: (id: number, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoIds,
  togglingTodoIds,
  addingTodoId,
  updatingTodoIds,
  onDeleteTodo,
  onToggleTodo,
  onUpdateTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          isToggling={togglingTodoIds.includes(todo.id)}
          isUpdating={updatingTodoIds.includes(todo.id)}
          isAdding={todo.id === addingTodoId}
          onDelete={onDeleteTodo}
          onToggleCompleted={onToggleTodo}
          onUpdateTitle={onUpdateTitle}
        />
      ))}
    </section>
  );
};
