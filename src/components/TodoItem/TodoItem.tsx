import React, {
  FC, memo, useContext, useState, useRef, useEffect,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoErrors } from '../../types/ErrorMessages';
import { removeTodo, updateTodoTitle, updateTodoStatus } from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

type InputEvent = React.FormEvent<HTMLFormElement>
| React.FocusEvent<HTMLInputElement, Element>;

interface Props {
  todo: Todo,
  loadTodos: (id: number) => Promise<void>
  setErrorMessage: React.Dispatch<React.SetStateAction<TodoErrors>>
}

export const TodoItem: FC<Props> = memo(({
  todo,
  loadTodos,
  setErrorMessage,
}) => {
  const { completed, id, title } = todo;
  const user = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEdiding] = useState<boolean>(false);
  const [editorQuery, setEditorQuery] = useState<string>(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setIsLoading(true);
    const todoId = Number(event.currentTarget.value);

    try {
      await removeTodo(todoId);
      if (user) {
        loadTodos(user.id);
      }
    } catch (error) {
      setErrorMessage(TodoErrors.onDelete);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const userId = Number(event.target.value);
    const isChecked = event.target.checked;

    try {
      await updateTodoStatus(userId, isChecked);

      if (user) {
        loadTodos(user.id);
      }
    } catch (error) {
      setErrorMessage(TodoErrors.onUpdate);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setEditorQuery(value);
  };

  const handleUpdateTodoTitle = async () => {
    setIsLoading(true);
    setIsEdiding(false);
    try {
      await updateTodoTitle(id, editorQuery);
      if (user) {
        loadTodos(user.id);
      }
    } catch (error) {
      setErrorMessage(TodoErrors.onUpdate);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async () => {
    setIsLoading(true);
    setIsEdiding(false);
    try {
      await removeTodo(id);
      if (user) {
        loadTodos(user.id);
      }
    } catch (error) {
      setErrorMessage(TodoErrors.onDelete);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: InputEvent) => {
    event.preventDefault();

    if (!editorQuery) {
      handleDeleteTodo();

      return;
    }

    if (editorQuery === title) {
      setIsLoading(false);

      return;
    }

    handleUpdateTodoTitle();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdiding(false);
    }
  };

  const handleBlur = () => {
    if (!editorQuery) {
      handleDeleteTodo();
    } else {
      handleUpdateTodoTitle();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          value={id}
          onChange={handleComplete}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              name="TodoTitleField"
              placeholder="Empty todo will be deleted"
              type="text"
              className="todo__title-field"
              value={editorQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEdiding(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              value={id}
              onClick={handleDelete}
            >
              x
            </button>
          </>
        )}

      {isLoading === true && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
});
