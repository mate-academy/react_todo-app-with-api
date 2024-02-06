import {
  Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, patchTodos } from '../api/todos';
import { ErrorTypes } from '../types/ErrorTypes';
import { USER_ID } from '../utils/userId';

type Props = {
  index?: number | undefined,
  todo: Todo;
  tempTodo?: Todo;
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  id: number;
  setError: Dispatch<SetStateAction<ErrorTypes | null>>;
  todos: Todo[];
  inputRefAdd: React.Ref<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  index, todo, setTodos, id, setError, todos, tempTodo, inputRefAdd,
}) => {
  const [loading, setLoading] = useState(false);
  const firstUpdate = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [edit, setEdit] = useState(false);
  const [editedTitle, setEditedTitle]
    = useState<string>(todo.title);

  const handleToggle = async () => {
    if (index || index === 0) {
      const querryObj = {
        userId: USER_ID,
        completed: !todo.completed,
      };

      try {
        setLoading(true);
        await patchTodos(id, querryObj);
        const newTodo = {
          ...todo,
          completed: !todo.completed,
        };
        const newTodos = [
          ...todos.slice(0, index),
          newTodo,
          ...todos.slice(index + 1),
        ];

        setTodos(newTodos);
      } catch (err) {
        setError(ErrorTypes.UPDATE_TODO);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDestroy = async () => {
    try {
      setLoading(true);
      await deleteTodo(USER_ID, id);
      if (index || index === 0) {
        setTodos(prevTodos => {
          return [
            ...prevTodos.slice(0, index),
            ...prevTodos.slice(index + 1),
          ];
        });
        if (inputRefAdd) {
          inputRefAdd.current.focus();
        }
      }
    } catch {
      setError(ErrorTypes.DELETE_TODO);
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firstUpdate.current || tempTodo) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 900);
    }

    firstUpdate.current = false;
  }, [todo.completed, tempTodo]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.code === 'Escape') {
      setEdit(false);
      setEditedTitle(todo.title);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value.trim());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEdit(false);
    const querryObj = {
      userId: USER_ID,
      title: editedTitle,
    };

    if (editedTitle && editedTitle !== todo.title) {
      try {
        setLoading(true);
        await patchTodos(id, querryObj);
        const newTodo = {
          ...todo,
          title: editedTitle,
        };

        if (index || index === 0) {
          setTodos((prevTodoss) => [
            ...prevTodoss.slice(0, index),
            newTodo,
            ...prevTodoss.slice(index + 1),
          ]);
        }
      } catch {
        setError(ErrorTypes.UPDATE_TODO);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } finally {
        setLoading(false);
      }
    } else if (!editedTitle) {
      handleDestroy();
    }
  };

  const handleDoubleClick = () => {
    setEdit(true);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        editing: edit,
      })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleToggle}
          checked={todo.completed}
        />
      </label>

      {!edit && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDestroy}
          >
            ×
          </button>
        </>
      )}

      {edit && (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={editedTitle}
            onChange={handleChange}
            onKeyUp={handleKeyPress}
            tabIndex={0}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
