/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[];
  handleDelete: (id: number) => void;
  loadingTodoId: number | null;
  handleToggle: (id: number, data: Partial<Todo>) => void;
  handleStartEditing: (id: number, todoTitle: string) => void;
  editingTodoId: number | null;
  handleCancelEditing: () => void;
  editedTitle: string;
  handleRenameTodo: (id: number, todoTitle: string) => void;
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  handleDelete,
  loadingTodoId,
  handleToggle,
  handleStartEditing,
  editingTodoId,
  handleCancelEditing,
  editedTitle,
  handleRenameTodo,
  setEditedTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          isLoading={todo.id === loadingTodoId}
          handleToggle={handleToggle}
          handleStartEditing={handleStartEditing}
          editingTodoId={editingTodoId}
          handleCancelEditing={handleCancelEditing}
          editedTitle={editedTitle}
          handleRenameTodo={handleRenameTodo}
          setEditedTitle={setEditedTitle}
        />
      ))}
    </section>
  );
};
