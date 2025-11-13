import React from 'react';
import { Todo as TodoType } from '../../types/todo';
import { Todo } from '../Todo/Todo';

type Props = {
  visibleTodos: TodoType[];
  tempTodo: TodoType | null;
  onDeleteTodo: (id: number) => void;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  onUpdateTodo: (id: number, updatedTodo: Partial<TodoType>) => void;
  editingId: number | null;
  onEditingIdChange: (id: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  onDeleteTodo,
  deletingTodoIds,
  updatingTodoIds,
  onUpdateTodo,
  editingId,
  onEditingIdChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          deletingTodoIds={deletingTodoIds}
          updatingTodoIds={updatingTodoIds}
          onUpdateTodo={onUpdateTodo}
          editingId={editingId}
          onEditingIdChange={onEditingIdChange}
        />
      ))}

      {tempTodo && (
        <Todo
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          deletingTodoIds={[]}
          updatingTodoIds={[tempTodo.id]}
          editingId={null}
          onEditingIdChange={onEditingIdChange}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
};
