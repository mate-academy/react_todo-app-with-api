/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { TodoInterface } from '../../types/Todo';

interface Props {
  todo: TodoInterface;
  deleteTodos: (content: number[], inputEdit?: boolean) => Promise<void>;

  setTodosForModify: React.Dispatch<React.SetStateAction<TodoInterface[]>>;
  todosForModify: TodoInterface[];

  updateTodos: (updateTodo: TodoInterface[]) => Promise<void>;
}

export const Todo: React.FC<Props> = ({
  todo,
  deleteTodos,
  setTodosForModify,
  todosForModify,
  updateTodos,
}) => {
  const [value, setValue] = useState(todo.title);
  const [canEdit, setCanEdit] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const prevValue = useRef<string | null>(null);

  const { title, completed, id } = todo;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleDoubleClick = () => {
    setCanEdit(true);
    prevValue.current = value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const content = e.target.value;

    setValue(content);
  };

  const handledeleteTodo = () => {
    setTodosForModify(prev => [...prev, todo]);

    const content = [id];

    deleteTodos(content);
  };

  const updateTodo = (
    currentTodo: TodoInterface,
    status?: string,
  ): TodoInterface => {
    let state = false;

    if (status) {
      state = currentTodo.completed;
    } else {
      state = currentTodo.completed ? false : true;
    }

    return {
      id: currentTodo.id,
      userId: currentTodo.userId,
      title: value ? value.trim() : currentTodo.title,
      completed: state,
    };
  };

  const handleUpdateTodo = (way?: string) => {
    if (prevValue.current) {
      const oldValue = prevValue.current;

      if (oldValue.trim() === value.trim()) {
        setCanEdit(false);
        setValue(value.trim());

        return;
      }
    }

    const newTodo = updateTodo(todo, way);

    setTodosForModify(prev => [...prev, newTodo]);

    const content = [newTodo];

    if (value) {
      updateTodos(content);
    } else {
      const deleteTodo = [newTodo.id];

      deleteTodos(deleteTodo, canEdit);
    }
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleUpdateTodo('go');
    setValue(value.trim());
  };

  const handleCancel = () => {
    if (prevValue.current) {
      setValue(prevValue.current);

      setCanEdit(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    if (canEdit) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleOnBlur = () => {
    handleUpdateTodo('go');

    setValue(value.trim());
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', 'item-enter-done', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => {
            handleUpdateTodo();
          }}
        />
      </label>

      {canEdit && (
        <form onSubmit={handleOnSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onBlur={() => {
              setCanEdit(false);
              handleOnBlur();
            }}
            onChange={handleChange}
          />
        </form>
      )}

      {!canEdit && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      {!canEdit && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handledeleteTodo}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todosForModify.find(item => item.id === todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
