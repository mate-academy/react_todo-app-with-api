import React from 'react';
import { Todo } from '../../types/Todo';
import { ToDo } from '../ToDo/ToDo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onRemove: (todoId: number) => void
  deletingToDoId: number[];
  onStatusChange: (todoId: number, data: boolean) => void;
  onTitleChange: (todoId: number, title: string) => void;
};

export const ToDoList: React.FC<Props> = ({
  todos,
  onRemove,
  tempTodo,
  deletingToDoId,
  onStatusChange,
  onTitleChange,
}) => {
  const isTodoEditing = (id: number) => {
    return deletingToDoId.includes(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <ToDo
          key={todo.id}
          todo={todo}
          onRemove={onRemove}
          isEditing={isTodoEditing(todo.id || 0)}
          onStatusChange={onStatusChange}
          onTitleChange={onTitleChange}
        />
      ))}

      {tempTodo && (
        <ToDo todo={tempTodo} isTemp />
      )}
    </section>
  );
};
