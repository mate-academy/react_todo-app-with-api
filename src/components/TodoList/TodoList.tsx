import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  visibleTodos: TodoType[];
  handleDeleteTodo: (id: number) => void;
  deleteId: number[];
  temporaryTodo: TodoType | null;
  handleToggleStatus: (id: number, completed: boolean) => void;
  editingTodoId: number | null;
  handleUpdateTitle: (id: number, title: string) => void;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  handleDeleteTodo,
  deleteId,
  temporaryTodo,
  handleToggleStatus,
  editingTodoId,
  handleUpdateTitle,
  setEditingTodoId,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          deleteId={deleteId}
          handleToggleStatus={handleToggleStatus}
          editingTodoId={editingTodoId}
          handleUpdateTitle={handleUpdateTitle}
          setEditingTodoId={setEditingTodoId}
          loadingIds={loadingIds}
        />
      ))}

      {temporaryTodo && (
        <Todo
          todo={temporaryTodo}
          handleDeleteTodo={() => {}}
          deleteId={[0]}
          handleToggleStatus={() => {}}
          editingTodoId={null}
          handleUpdateTitle={() => {}}
          setEditingTodoId={() => {}}
          loadingIds={[]}
        />
      )}
    </section>
  );
};
