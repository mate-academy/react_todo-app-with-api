import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodos } from '../../api/todos';
import { wait } from '../../utils/fetchClient';

type Props = {
  todo: Todo;
  addTodoId: number | null;
  handleDeleteTodo: (id: number) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAddTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  changeTitleByid: (currentTodo: Todo) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  changeCopletedById: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  addTodoId,
  handleDeleteTodo,
  setLoading,
  setAddTodoId,
  changeTitleByid,
  setErrorMessage,
  changeCopletedById,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const editRef = useRef<HTMLInputElement>(null);

  const onDeleteClick = useCallback(() => {
    handleDeleteTodo(todo.id);
  }, [todo.id, handleDeleteTodo]);

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleInputValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditTitle(event.target.value);
  };

  const seveNewTitle = () => {
    setLoading(true);
    setAddTodoId(todo.id);

    const updateTodo: Todo = {
      ...todo,
      title: editTitle,
    };

    updateTodos(updateTodo)
      .then(() => {
        changeTitleByid(updateTodo);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        return wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setLoading(false);
        setAddTodoId(null);
      });
  };

  const onChangeTittle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editTitle.trim().length === 0) {
      handleDeleteTodo(todo.id);
      setIsEdit(false);

      return;
    }

    seveNewTitle();
    setIsEdit(false);
  };

  const onCompleted = () => {
    setLoading(true);
    setAddTodoId(todo.id);

    const newTodo: Todo = {
      id: todo.id,
      title: todo.title,
      userId: todo.userId,
      completed: !todo.completed,
    };

    updateTodos(newTodo)
      .then(() => changeCopletedById(todo.id))
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        return wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setLoading(false);
        setAddTodoId(null);
      });
  };

  const handleOnBlur = () => {
    if (editTitle.trim().length === 0) {
      handleDeleteTodo(todo.id);
    }

    setIsEdit(false);
  };

  useEffect(() => {
    if (editRef.current) {
      editRef.current.focus();
    }
  }, [isEdit]);

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', { completed: todo.completed })}
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
              onClick={onDeleteClick}
            >
              ×
            </button>
          </>
        )}

        {isEdit && (
          <form onSubmit={onChangeTittle}>
            <input
              type="text"
              className="todo__title-field edit "
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={handleInputValueChange}
              ref={editRef}
              onBlur={handleOnBlur}
            />
          </form>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
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
