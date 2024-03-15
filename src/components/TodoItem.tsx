import classNames from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { updateTodos } from '../api/todos';
import { wait } from '../utils/fetchClient';

type Props = {
  todo: Todo;
  addTodoId: number | null;
  handleDeleteTodo: (id: number) => void;
  updateTodoTitleById: (currentTodo: Todo) => void;
  updateCompletedById: (todoId: number) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setAddTodoId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  addTodoId,
  setAddTodoId,
  handleDeleteTodo,
  updateTodoTitleById,
  updateCompletedById,
  setLoading,
  setErrorMessage,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const editRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEdit(true);
    setTimeout(() => editRef.current?.focus(), 0);
  };

  const onDelete = useCallback(() => {
    handleDeleteTodo(todo.id);
  }, [todo.id, handleDeleteTodo]);

  const onChangeTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      onDelete();

      return;
    }

    if (editTitle === todo.title) {
      setIsEdit(false);

      return;
    }

    setLoading(true);
    setAddTodoId(todo.id);

    const updatedTodo: Todo = {
      ...todo,
      title: editTitle,
    };

    updateTodos(updatedTodo)
      .then(() => {
        updateTodoTitleById(updatedTodo);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        return wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setLoading(false);
        setAddTodoId(null);
        setIsEdit(false);
      });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleOnBlur = () => {
    setIsEdit(false);
  };

  const onCompleted = () => {
    updateCompletedById(todo.id);
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
        onDoubleClick={handleEdit}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onClick={onCompleted}
          />
        </label>

        {!isEdit && (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {editTitle}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

        {isEdit && (
          <form onSubmit={onChangeTitle}>
            <input
              type="text"
              className="todo__title-field edit "
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={handleTitleChange}
              ref={editRef}
              onBlur={handleOnBlur}
            />
          </form>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': addTodoId === todo.id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
