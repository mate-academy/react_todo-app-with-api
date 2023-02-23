import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => void;
  isDeleteWaiting: boolean;
  todosIdsToRemove: number[];
  changeRemoveTodoIds: (id: number[]) => void;
  removeDeleteId: (id: number) => void;
  changeCompletedStatus: (todoId: number, status: boolean) => void;
  isUpdateWaiting: boolean;
  todosIdsToUpdate: number[];
  changeTodosIdsToUpdate: (value: number) => void;
  removeUpdatedId: (value: number) => void;
  changeTodoTitle: (todoId: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  isDeleteWaiting,
  todosIdsToRemove,
  changeRemoveTodoIds,
  removeDeleteId,
  changeCompletedStatus,
  isUpdateWaiting,
  todosIdsToUpdate,
  changeTodosIdsToUpdate,
  removeUpdatedId,
  changeTodoTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          isDeleteWaiting={isDeleteWaiting}
          changeRemoveTodoIds={changeRemoveTodoIds}
          removeDeleteId={removeDeleteId}
          todosIdsToRemove={todosIdsToRemove}
          changeCompletedStatus={changeCompletedStatus}
          isUpdateWaiting={isUpdateWaiting}
          todosIdsToUpdate={todosIdsToUpdate}
          changeTodosIdsToUpdate={changeTodosIdsToUpdate}
          removeUpdatedId={removeUpdatedId}
          changeTodoTitle={changeTodoTitle}
        />
      ))}

      {tempTodo !== null && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {tempTodo!.title}
          </span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
