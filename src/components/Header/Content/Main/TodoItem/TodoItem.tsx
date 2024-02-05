import cn from 'classnames';
import {
  useContext, useRef, useEffect, useState,
} from 'react';
import { Todo } from '../../../../../types/Todo';
import { TodosContext } from '../../../../../Context/TodosContext';

type Props = {
  todo: Todo,
  isTempTodo?: boolean,
};

const ENTER_KEY = 'Enter';
const ESCAPE_KEY = 'Escape';

export const TodoItem: React.FC<Props> = ({ todo, isTempTodo }) => {
  const {
    toggleTodoStatus,
    handleUpdateTodo,
    handleDeleteTodo,
    loadingIds,
  } = useContext(TodosContext);

  const [isEdit, setIsEdit] = useState(false);
  const [editingText, setEditingText] = useState(todo.title);

  const isTodoLoading = loadingIds.includes(todo.id);

  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [isEdit]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ENTER_KEY && editingText) {
      setIsEdit(false);
      handleUpdateTodo({ ...todo, title: editingText });
    }

    if (event.key === ENTER_KEY && !editingText) {
      setIsEdit(false);
      handleDeleteTodo(todo.id);
    }
  };

  const handleBlur = () => {
    if (editingText) {
      setIsEdit(false);
      handleUpdateTodo({ ...todo, title: editingText });
    }

    if (!editingText) {
      setIsEdit(false);
      handleDeleteTodo(todo.id);
    }
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ESCAPE_KEY) {
      setIsEdit(false);
      setEditingText(todo.title);
      handleUpdateTodo({ ...todo, title: todo.title });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(event.target.value);
  };

  const handleSpan = () => {
    setIsEdit(true);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => toggleTodoStatus(
            { ...todo, completed: !todo.completed },
          )}
        />
      </label>

      {isEdit
        ? (
          <form
            action=""
            method="post"
          >
            <input
              type="text"
              className="todo todo__field"
              name="editingField"
              ref={inputFocus}
              value={editingText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleOnKeyUp}
              tabIndex={0}
              onBlur={handleBlur}
            />
          </form>

        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleSpan}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isTempTodo || isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
