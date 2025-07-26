import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  processingIds: Todo['id'][];
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  focusInput: () => void | undefined;
  editingTodoId: number | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  handleToggle: (todo: Todo) => Promise<void>;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  processingIds,
  setProcessingIds,
  setErrorMessage,
  setTodos,
  focusInput,
  handleToggle,
  editingTodoId,
  setEditingTodoId,
  editingTitle,
  setEditingTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setProcessingIds={setProcessingIds}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          processingIds={processingIds}
          focusInput={focusInput}
          handleToggle={handleToggle}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isTempTodo={true}
          setProcessingIds={setProcessingIds}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          processingIds={processingIds}
          focusInput={focusInput}
          handleToggle={handleToggle}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
        />
      )}
    </section>
  );
};
