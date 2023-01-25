import {
  // prettier-ignore
  ChangeEvent,
  FC,
  FormEvent,
  useState,
  useEffect,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodoContext } from '../../store/todoContext';
import { TodoLoader } from './TodoLoader';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/Error';

type Props = {
  todo: Todo;
};

export const TodoItem: FC<Props> = ({ todo: t }) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const { deleteSingleTodo, toggleTodo, setError } = useTodoContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [titleEditField, setTitleEditField] = useState(todo?.title || '');

  const cancelUpdate = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditMode(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', cancelUpdate);

    return () => document.removeEventListener('keydown', cancelUpdate);
  }, []);

  useEffect(() => {
    setTodo(t);
  }, [t]);

  if (!todo) {
    return null;
  }

  const todoToggle = () => {
    toggleTodo(todo.id);
  };

  const setNewTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleEditField(e.target.value);
  };

  const updateTitle = async () => {
    if (titleEditField === todo.title) {
      return;
    }

    if (titleEditField === '') {
      try {
        setIsDeleting(true);

        await deleteTodo(todo.id);
        setTodo(null);
      } catch {
        setError(true, ErrorMessage.DeleteError);
      } finally {
        setIsDeleting(false);
      }
    } else {
      const newTodo = {
        ...todo,
        title: titleEditField,
      };

      try {
        setIsDeleting(true);

        const result = await updateTodo(todo.id, newTodo);

        setTodo(result);
      } catch {
        setError(true, ErrorMessage.UpdateError);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsEditMode(false);
    updateTitle();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={todoToggle}
        />
      </label>
      {!isEditMode ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditMode(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => deleteSingleTodo(todo.id, setIsDeleting)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="todo__title-field"
            value={titleEditField}
            onChange={setNewTitle}
            onBlur={() => {
              setIsEditMode(false);
              updateTitle();
            }}
          />
        </form>
      )}

      <TodoLoader
        isDeleting={isDeleting}
        todo={todo}
      />
    </div>
  );
};
