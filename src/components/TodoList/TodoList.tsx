/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Todo } from '../../types/todo';
import { TodoInfo } from '../TodoInfo';

interface Props {
  todos: Todo[];
  removeTodo: (arg: number) => Promise<boolean>;
  processingIds: number[];
  onUpdate: (id: number, data: Partial<Todo>) => Promise<boolean>;
  editingTodoId: number | null;
  onEdit: (todoId: number | null) => void;
}

const TodoListComponent: React.FC<Props> = ({
  todos,
  removeTodo,
  processingIds,
  onUpdate,
  editingTodoId,
  onEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          isProcessing={processingIds.includes(todo.id) || todo.id === 0}
          onUpdate={onUpdate}
          editingTodoId={editingTodoId}
          onEdit={onEdit}
        />
      ))}
    </section>
  );
};

export const TodoList = React.memo(TodoListComponent);
