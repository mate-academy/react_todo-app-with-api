import React, {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from 'react';

import { Todo } from '../../types/Todo';
import { UpdateTodoData } from '../../types/UpdateTodoData';
import { Form } from './../Form';

import classNames from 'classnames';

type Props<T> = {
  todo: T;
  isActive: boolean;
  removeTodo?: (id: number) => void;
  toggleTodoStatus?: () => void;
  onUpdateTodo?: (id: number, data: UpdateTodoData) => Promise<void>;
  updateProcessingTodos?: (id: number) => void;
  removeProcessingTodos?: (id: number) => void;
};

export const TodoItem: React.FC<Props<Todo>> = ({
  todo,
  isActive,
  removeTodo = () => {},
  toggleTodoStatus = () => {},
  onUpdateTodo,
  updateProcessingTodos,
  removeProcessingTodos,
}) => {
  const { completed, id, title } = todo;

  const [formActive, setFormActive] = useState<boolean>(false);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const dbClickHandler = () => {
    setFormActive(true);
    setTodoTitle(title);
  };

  const onEdit = useCallback(async () => {
    if (!todoTitle.length) {
      removeTodo?.(id);

      return;
    }

    updateProcessingTodos?.(id);

    if (todoTitle !== title) {
      onUpdateTodo?.(id, { title: todoTitle.trim() })
        .then(() => setFormActive(false))
        .catch(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        })
        .finally(() => removeProcessingTodos?.(id));
    } else if (todoTitle === title) {
      setFormActive(false);
    }
  }, [id, title, todoTitle]);

  const onEditHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
        removeProcessingTodos?.(id);
      }
    },
    [id, removeProcessingTodos, title],
  );

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
        'temp-item-enter temp-item-enter-active': id === 0,
      })}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
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
          addTodo={onEditHandler}
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          onBlur={onBlurHandler}
          onCancel={e => keyUpHandler(e)}
          inputRef={inputRef}
          classNames="todo__title-field"
          dataCy="TodoTitleField"
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
};
