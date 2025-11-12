import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo?: (todoId: number) => void;
  idsToDelete?: number[];
  onToggleStatus: (todoId: number, completed: boolean) => Promise<void>;
  updatingTodos: number[];
  onUpdate: (todoId: number, updatedData: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo = () => {},
  idsToDelete = [],
  onToggleStatus,
  updatingTodos,
  onUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={() => onDeleteTodo(todo.id)}
        isDeleting={idsToDelete.includes(todo.id)}
        onToggleStatus={() => onToggleStatus(todo.id, !todo.completed)}
        isUpdating={updatingTodos.includes(todo.id)}
        onUpdate={onUpdate}
      />
    ))}

    {tempTodo && <TodoItem key={tempTodo.id} todo={tempTodo} isTemp={true} />}
  </section>
);
