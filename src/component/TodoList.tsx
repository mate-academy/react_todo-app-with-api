import React, { RefObject } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
  toggleTodo: (id: number) => void;
  handleDelete: (id: number) => void;
  loadingTodoId: number[];
  handleUpdate: (updatedTodo: Todo) => void;
  setError: (message: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  editTodoId: number | null;
  setEditTodoId: (id: number | null) => void;
  isProcessingTodos: boolean;
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  toggleTodo,
  handleDelete,
  loadingTodoId,
  handleUpdate,
  inputRef,
  editTodoId,
  setEditTodoId,
  isProcessingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          handleDelete={handleDelete}
          loadingTodoId={loadingTodoId}
          handleUpdate={handleUpdate}
          isEditing={editTodoId === todo.id}
          setEditTodoId={setEditTodoId}
          inputRef={inputRef}
          isProcessingTodos={isProcessingTodos}
        />
      ))}
    </section>
  );
};
