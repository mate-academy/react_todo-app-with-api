/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  FormEvent,
  KeyboardEvent,
  memo,
  useCallback,
  useRef,
  useState,
} from 'react';
import { Todo, UpdateTodoData } from '../types/Todo';
import classNames from 'classnames';
import { Form } from './Form';

interface Props<T> {
  todo: T;
  isActive: boolean;
  removeTodo?: (id: number) => void;
  toggleTodoStatus?: () => void;
  onUpdateTodo?: (id: number, data: UpdateTodoData) => Promise<void>;
  updateProcessingsTodos?: (id: number) => void;
  removeProcessingsTodos?: (id: number) => void;
}

export const TodoItem = memo((props: Props<Todo>) => {
  const {
    todo,
    isActive,
    removeTodo = () => {},
    toggleTodoStatus = () => {},
    onUpdateTodo,
    updateProcessingsTodos,
    removeProcessingsTodos,
  } = props;

  const { completed, id, title } = todo;

  const [formActive, setFormActive] = useState<boolean>(false);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const dbClickHandler = () => {
    setFormActive(true);
    setTodoTitle(title);
  };

  const onEdit = useCallback(async () => {
    if (todoTitle.length === 0) {
      removeTodo?.(id);

      return;
    }

    updateProcessingsTodos?.(id);

    if (todoTitle !== title) {
      onUpdateTodo?.(id, { title: todoTitle.trim() })
        .then(() => setFormActive(false))
        .catch(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        })
        .finally(() => removeProcessingsTodos?.(id));
    } else if (todoTitle === title) {
      setFormActive(false);
      setTodoTitle(title);
    }
  }, [
    id,
    onUpdateTodo,
    removeProcessingsTodos,
    removeTodo,
    title,
    todoTitle,
    updateProcessingsTodos,
  ]);

  const onEditHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onEdit();
  };

  const onBlurHandler = () => {
    onEdit();
  };

  const removeTodoHandler = () => {
    removeTodo?.(id);
  };

  const keyUpHandler = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setFormActive(false);
        setTodoTitle(title);
        removeProcessingsTodos?.(id);
      }
    },
    [id, removeProcessingsTodos, title],
  );

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        'temp-item-enter temp-item-enter-active': id === 0,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={toggleTodoStatus}
        />
      </label>

      {formActive ? (
        <Form
          onSubmit={onEditHandler}
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          onBlur={onBlurHandler}
          classNames="todo__title-field"
          onCancel={e => keyUpHandler(e)}
          dataCy="TodoTitleField"
          inputRef={inputRef}
        />
      ) : (
        <>
          <span
            onDoubleClick={dbClickHandler}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={removeTodoHandler}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        {isActive && <div className="loader" />}
      </div>
    </div>
  );
});
