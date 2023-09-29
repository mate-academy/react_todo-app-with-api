import classNames from 'classnames';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { useTodo } from '../hooks/useTodo';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isItemLoading, setIsItemLoading] = useState(todo.id === 0);
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const todoTitleField = useRef<HTMLInputElement>(null);
  const {
    isLoadingTodoIds,
    handleDeleteTodo,
    handleUpdateTodo,
  } = useTodo();

  const onCheckboxChange = async () => {
    setIsItemLoading(true);
    await handleUpdateTodo(todo, { completed: !todo.completed });
    setIsItemLoading(false);
  };

  const onTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const onTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const onTodoSave = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsItemLoading(true);
    const title = todoTitle.trim();

    if (title === todo.title) {
      setIsEditing(false);
      setIsItemLoading(false);

      return;
    }

    if (title) {
      await handleUpdateTodo(todo, { title });
    } else {
      await handleDeleteTodo(todo.id);
    }

    setIsEditing(false);
    setIsItemLoading(false);
  };

  const onTodoDelete = async () => {
    setIsItemLoading(true);
    await handleDeleteTodo(todo.id);
    setIsItemLoading(false);
  };

  useEffect(() => {
    if (isEditing && todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [isEditing]);

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  });

  const isLoaderActive = (isLoadingTodoIds.includes(todo.id))
    || isItemLoading;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          id={todo.title}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onCheckboxChange}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={onTodoSave}
            onBlur={onTodoSave}
          >
            <input
              ref={todoTitleField}
              data-cy="NewTodoField"
              type="text"
              className="todo__title-field"
              placeholder="Empty title will be deleted"
              value={todoTitle}
              onChange={onTodoTitleChange}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              data-cy="TodoTitle"
              onDoubleClick={onTodoDoubleClick}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onTodoDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isLoaderActive,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
