import React, { forwardRef } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Actions = {
  onToggle: (todo: Todo) => void;
  onSave: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
};

type Props = {
  todos: Todo[];
  editingTodoId: number | null;
  editingTodoTitle: string;
  todoOnDeleting: number | null;
  todoOnUpdating: number | null;
  todosOnDeleting: number[];
  todosOnUpdating: number[];
  actions: Actions;
};

export const TodoList = React.memo(
  forwardRef<HTMLInputElement, Props>(
    (
      {
        todos,
        editingTodoId,
        editingTodoTitle,
        todoOnDeleting,
        todoOnUpdating,
        todosOnDeleting,
        todosOnUpdating,
        actions,
      },
      ref,
    ) => {
      const isTodoLoading = (todo: Todo): boolean => {
        return (
          todo.id === 0 ||
          todo.id === todoOnDeleting ||
          todo.id === todoOnUpdating ||
          todosOnDeleting.includes(todo.id) ||
          todosOnUpdating.includes(todo.id)
        );
      };

      return (
        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={editingTodoId === todo.id}
              editingTitle={editingTodoTitle}
              isLoading={isTodoLoading(todo)}
              actions={actions}
              ref={ref}
            />
          ))}
        </section>
      );
    },
  ),
);
