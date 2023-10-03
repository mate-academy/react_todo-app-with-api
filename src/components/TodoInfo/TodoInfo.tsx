import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodosContext';
import { updateTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/errorMessage';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const {
    todosIdsUpdating, deletingTodoHandler, statusChangeHandler, todos,
    setTodos, setTodosIdsUpdating, errorNotificationHandler,
  } = useContext(TodosContext);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [updatingTodo, setUpdatingTodo] = useState<Todo | null>(null);

  const formInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (formInput.current) {
      formInput.current.focus();
    }
  }, [updatingTodo]);

  const finishEditing = () => {
    setIsEditing(false);
    setUpdatingTodo(null);
  };

  const editHandler = () => {
    setIsEditing(true);
    setUpdatingTodo(todo);
  };

  const saveChangesHandler = () => {
    if (!title) {
      deletingTodoHandler(todo.id);

      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle === todo.title) {
      finishEditing();

      return;
    }

    setTodosIdsUpdating([todo.id]);

    setTitle(trimmedTitle);

    updateTodo(todo.id, { title: trimmedTitle })
      .then((response) => {
        setTodos(todos.map(currTodo => (
          currTodo.id === todo.id
            ? response as Todo
            : currTodo
        )));

        setIsEditing(false);
        setUpdatingTodo(null);
      })
      .catch(() => errorNotificationHandler(ErrorMessage.UPDATE))
      .finally(() => {
        setTodosIdsUpdating([]);
      });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveChangesHandler();
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Escape') {
      setTitle(todo.title);
      finishEditing();
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
      data-cy="Todo"
      onDoubleClick={editHandler}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => statusChangeHandler(todo.id, todo.completed)}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={onSubmitHandler}>
            <input
              type="text"
              className="todo__title-field"
              data-cy="TodoTitleField"
              placeholder="Empty todo will be deleted"
              value={title}
              onBlur={saveChangesHandler}
              onChange={(e) => setTitle(e.target.value)}
              ref={formInput}
              onKeyUp={onKeyUp}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              data-cy="TodoTitle"
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deletingTodoHandler(todo.id)}
            >
              ×
            </button>
          </>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': todosIdsUpdating.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
