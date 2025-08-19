import React from 'react';
import { TodoItem } from './todoitem';
import { Todo } from '../types/todo';

type Props = {
  todos: Todo[];
  savingIds: number[];
  onToggleTodo: (todo: Todo) => void;
  onRemoveTodo: (id: number) => void;
  onUpdateTitle: (id: number, newTitle: string) => Promise<boolean>;
  tempTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  savingIds,
  onToggleTodo,
  onRemoveTodo,
  onUpdateTitle,
  tempTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isSaving = savingIds.includes(todo.id) || todo.id === tempTodoId;

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isSaving={isSaving}
            onToggle={() => onToggleTodo(todo)}
            onRemove={() => onRemoveTodo(todo.id)}
            onUpdateTitle={onUpdateTitle}
          />
        );
      })}
    </section>
  );
};
