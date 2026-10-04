import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  edit: number | null;
  editTitle: string;
  visibleTodos: TodoType[];
  toggleTodo: (todo: TodoType) => void;
  loadingTodoIds: number[];
  handleEdit: (todo: TodoType) => void;
  setEditTitle: (value: string) => void;
  handleEditClick: (todo: TodoType) => void;
  handleDelete: (todo: TodoType) => void;
  setEdit: (value: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  edit,
  editTitle,
  visibleTodos,
  toggleTodo,
  loadingTodoIds,
  handleEdit,
  setEditTitle,
  handleEditClick,
  handleDelete,
  setEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <Todo
          key={todo.id}
          edit={edit}
          editTitle={editTitle}
          toggleTodo={toggleTodo}
          loadingTodoIds={loadingTodoIds}
          handleEdit={handleEdit}
          setEditTitle={setEditTitle}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          todo={todo}
          setEdit={setEdit}
        />
      ))}
    </section>
  );
};
