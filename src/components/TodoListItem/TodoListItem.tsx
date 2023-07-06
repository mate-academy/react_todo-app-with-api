import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { UpdateTodoArgs } from '../../types/UpdateTodoArgs';
import { EditForm } from '../EditForm/EditForm';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  completedIds: number[];
  updateTodo: (
    todoId: number,
    data: UpdateTodoArgs,
  ) => void;
  loadingIds: number[];
  isLoading: boolean;
}

export const TodoListItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  completedIds,
  updateTodo,
  loadingIds,
  isLoading,
}) => {
  const [isEditField, setIsEditField] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const updateTodoHandler = async () => {
    await updateTodo(todo.id, { completed: !todo.completed });
  };

  const doubleClickHandler = () => {
    setIsEditField(true);
  };

  const submitButton = () => {
    if (todoTitle.trim()) {
      updateTodo(todo.id, { title: todoTitle });
    }

    if (!todoTitle.trim()) {
      deleteTodo(todo.id);
    }

    setIsEditField(false);
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={updateTodoHandler}
        />
      </label>

      {isEditField ? (
        <EditForm
          isLoading={isLoading}
          todoTitle={todoTitle}
          onTodoTitle={setTodoTitle}
          submitButton={submitButton}
        />
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={doubleClickHandler}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn('modal', 'overlay', {
          'is-active': completedIds.includes(todo.id)
          || loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
