import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';
import { editTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  todo: Todo,
  onTodoDelete: (value: number) => void,
  loadTodos: () => void,
  onErrorsChange: (value: ErrorMessage) => void,
}

export const TodoItem: React.FC<Props> = (
  {
    todo,
    onTodoDelete,
    loadTodos,
    onErrorsChange,
  },
) => {
  const [loading, setLoading] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const newTodoTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoTitle.current) {
      newTodoTitle.current.focus();
    }
  });

  const editTodoById = async () => {
    await editTodo(todo.id, { completed: !todo.completed });

    await loadTodos();
  };

  // const handleDoubleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
  //   if (event.detail === 2) {
  //     setIsEditFormVisible(!isEditFormVisible);
  //   }
  // };

  const onUpdateTitle = async () => {
    if (todo.title === title) {
      setIsEditFormVisible(!isEditFormVisible);

      return;
    }

    try {
      if (title === '') {
        setLoading(true);

        await onTodoDelete(todo.id);

        setLoading(true);

        return;
      }

      setIsEditFormVisible(!isEditFormVisible);

      setLoading(true);

      await editTodo(todo.id, { title });
      await loadTodos();

      setLoading(false);
    } catch {
      onErrorsChange(ErrorMessage.Update);
    }
  };

  const handlePressEsc = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditFormVisible(false);
        setTitle(todo.title);
      }
    }, [],
  );

  return (
    <>
      {loading ? (
        <Loader
          todo={todo}
        />
      ) : (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              value={title}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onClick={async () => {
                setLoading(true);

                await editTodoById();

                setLoading(false);
              }}
            />
          </label>

          {isEditFormVisible ? (
            <form
              onSubmit={onUpdateTitle}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                ref={newTodoTitle}
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                defaultValue={todo.title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
                onBlur={onUpdateTitle}
                onKeyDown={handlePressEsc}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => setIsEditFormVisible(!isEditFormVisible)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => {
                  setLoading(!loading);

                  onTodoDelete(todo.id);

                  setLoading(!loading);
                }}
              >
                ×
              </button>
            </>
          )}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-Active': loading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
