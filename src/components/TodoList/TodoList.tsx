import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todoList: Todo[],
  inputValue: string,
  isAdding: boolean,
  targetTodoId: number,
  setTargetTodoId: (todoId: number) => void,
  completedDelete: boolean,
  setChangeTodo: (todo: Todo) => void,
  changeCompleted: boolean,
  setCompletedDelete: (val: boolean) => void,
  changeValueSubmit: (todo: Todo) => void,
  isUpdating: boolean;
  setIsUpdating: (val: boolean) => void,
};

export const TodoList: React.FC<Props> = ({
  todoList,
  inputValue,
  isAdding,
  targetTodoId,
  setTargetTodoId,
  completedDelete,
  setChangeTodo,
  changeCompleted,
  setCompletedDelete,
  changeValueSubmit,
  isUpdating,
  setIsUpdating,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            targetTodoId={targetTodoId}
            setTargetTodoId={setTargetTodoId}
            completedDelete={completedDelete}
            setChangeTodo={setChangeTodo}
            changeCompleted={changeCompleted}
            setCompletedDelete={setCompletedDelete}
            changeValueSubmit={changeValueSubmit}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
          />
        </li>
      ))}

      {isAdding && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {inputValue}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </ul>
  );
};
