import {
  ChangeEvent,
  KeyboardEvent,
  FC,
  FormEvent,
  useState,
  useRef,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { CustomForm } from '../CustomForm';

interface TodoProps {
  todo: Todo;
  onRemove: (id: number) => void;
  loadTodoById: number[];
  updateTodo: (id: number, data: Partial<Todo>) => void;
}

export const TodoItem: FC<TodoProps> = ({
  todo,
  onRemove,
  updateTodo,
  loadTodoById,
}) => {
  const {
    completed,
    title,
    id,
  } = todo;

  const [changeTitle, setChangeTitle] = useState(title);
  const [isEdit, setIsEdit] = useState(false);

  const isActiveTodo = loadTodoById.includes(id);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleIsCompletedChange = () => {
    updateTodo(id, { completed: !completed });
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChangeTitle(event.target.value);
  };

  const handleEditChange = () => {
    setIsEdit(prevIsEdit => !prevIsEdit);
  };

  const closeEditMode = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setChangeTitle(title);
      setIsEdit(false);
    }
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!changeTitle.trim()) {
      onRemove(id);
    } else if (title !== changeTitle) {
      updateTodo(id, { title: changeTitle });
      setIsEdit(false);
    }

    setIsEdit(false);
  };

  return (
    <div className={classNames('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleIsCompletedChange}
        />
      </label>

      {isEdit
        ? (
          <CustomForm
            onSubmit={handleFormSubmit}
            className="todo__title-field"
            type="text"
            placeholder="Empty todo will be deleted"
            value={changeTitle}
            onBlur={handleFormSubmit}
            onChange={handleTitleChange}
            onKeyUp={closeEditMode}
            ref={inputRef}
          />
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleEditChange}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemove(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': isActiveTodo,
      })}
      >
        <div className="modal-background has-background-white-ter" />

        <div className="loader" />
      </div>
    </div>
  );
};
