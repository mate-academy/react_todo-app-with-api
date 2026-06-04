import React from 'react';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  diseBledX: Todo | null;
  handleChangeComplete: (todoId: number) => void;

  editingTodoId: number | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  handleEditSubmit: (todoId: number) => void;

  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;

  handleDobelChangeTitle: (todo: Todo) => void;

  removeElement: (todoId: number) => void;

  loadingTodoId: number[];
};
export const Main: React.FC<Props> = ({
  visibleTodos,
  handleChangeComplete,
  editingTodoId,
  setEditingTodoId,
  handleEditSubmit,
  editTitle,
  setEditTitle,
  handleDobelChangeTitle,
  removeElement,
  loadingTodoId,
  tempTodo,
  diseBledX,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingTodoId={loadingTodoId}
          handleChangeComplete={handleChangeComplete}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          handleEditSubmit={handleEditSubmit}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          handleDobelChangeTitle={handleDobelChangeTitle}
          removeElement={removeElement}
          diseBledX={diseBledX}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isTemp={true}
          loadingTodoId={loadingTodoId}
          handleChangeComplete={handleChangeComplete}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          handleEditSubmit={handleEditSubmit}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          handleDobelChangeTitle={handleDobelChangeTitle}
          removeElement={removeElement}
          diseBledX={diseBledX}
        />
      )}
    </section>
  );
};
