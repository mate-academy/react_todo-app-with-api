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

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.ChangeEvent<HTMLFormElement>) => {
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

  const handleTodoDelete = async () => {
    setIsItemLoading(true);
    await handleDeleteTodo(todo.id);
    setIsItemLoading(false);
  };

  useEffect(() => {
    if (isEditing && todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [isEditing]);

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(todo.title);
    }
  };

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
            onSubmit={handleTodoSave}
            onBlur={handleTodoSave}
          >
            <input
              ref={todoTitleField}
              data-cy="NewTodoField"
              type="text"
              className="todo__title-field"
              placeholder="Empty title will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
              onKeyUp={handleKeyUp}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              data-cy="TodoTitle"
              onDoubleClick={handleTodoDoubleClick}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleTodoDelete}
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
