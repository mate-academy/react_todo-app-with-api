import React from 'react';
import { Todo } from '../../types';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;

  loadingTodoIds: number[];
  editingTodoId: number | null;

  handleUpdateTodo: (originalTodo: Todo, updatedTodo: Todo) => void;
  handleTodoEditing: (todo: Todo) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
  editedTodoTitle: string;
  setEditedTodoTitle: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  setEditingTodoId: (id: number | null) => void;
  handleDeleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  loadingTodoIds,
  editingTodoId,
  handleUpdateTodo,
  handleTodoEditing,
  editInputRef,
  editedTodoTitle,
  setEditedTodoTitle,
  handleKeyDown,
  setEditingTodoId,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const isLoadingTodo = loadingTodoIds.includes(todo.id);
        const isEditing = editingTodoId === todo.id;

        return (
          <TodoItem
            key={todo.id}
            isLoadingTodo={isLoadingTodo}
            isEditing={isEditing}
            todo={todo}
            handleUpdateTodo={handleUpdateTodo}
            handleTodoEditing={handleTodoEditing}
            editInputRef={editInputRef}
            editedTodoTitle={editedTodoTitle}
            setEditedTodoTitle={setEditedTodoTitle}
            handleKeyDown={handleKeyDown}
            setEditingTodoId={setEditingTodoId}
            handleDeleteTodo={handleDeleteTodo}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          isLoadingTodo={true}
          isEditing={false}
          todo={tempTodo}
        />
      )}
    </section>
  );
};
