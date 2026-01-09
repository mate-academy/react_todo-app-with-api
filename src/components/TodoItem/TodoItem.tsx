/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { TodoLoader } from '../TodoLoader';
import {
  FormEvent,
  KeyboardEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo, TodoUpdateData } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { StateSetter } from '../../types/StateSetter';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  todo: Todo;
  nodeRef: RefObject<HTMLDivElement>;
  setTodos: StateSetter<Todo[]>;
  setError: (msg: string, timeout?: number) => void;
  loadingIds: number[];
  addLoadingId: (postId: number) => void;
  removeLoadingId: (postId: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  nodeRef,
  setTodos,
  setError,
  loadingIds,
  addLoadingId,
  removeLoadingId,
}) => {
  const loading = loadingIds.includes(todo.id) || todo.id === 0;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo?.title || '');
  const todoInputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!!editing) {
      todoInputField.current?.focus();
    }
  }, [editing]);

  // -- Delete --
  const handleDelete = async (todoId: number) => {
    addLoadingId(todoId);
    try {
      await deleteTodo(todoId);
      setTodos((currentTodos: Todo[]) =>
        currentTodos.filter(t => t.id !== todoId),
      );
    } catch {
      setError(ErrorMessage.DELETE);
      removeLoadingId(todoId);
    }
  };

  // -- Update --
  const handleUpdate = async (todoToUpdate: TodoUpdateData) => {
    addLoadingId(todoToUpdate.id);
    setError(ErrorMessage.NONE);

    updateTodo(todoToUpdate)
      .then((updatedTodo: Todo) => {
        setTodos((currentTodos: Todo[]) =>
          currentTodos.map(originalTodo =>
            originalTodo.id === todoToUpdate.id ? updatedTodo : originalTodo,
          ),
        );
        setEditing(false);
      })
      .catch(() => setError(ErrorMessage.UPDATE, 3000))
      .finally(() => removeLoadingId(todoToUpdate.id));
  };

  const toggle = () => {
    handleUpdate({ id: todo.id, completed: !todo.completed });
  };

  const rename = (event: FormEvent) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      handleDelete(todo.id);
    } else if (todo.title !== cleanTitle) {
      handleUpdate({ id: todo.id, title: cleanTitle });
    } else {
      setEditing(false);
    }
  };

  const reset = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditing(false);
      setTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      ref={nodeRef}
      className={classNames('todo', { completed: !!todo.completed })}
      onDoubleClick={() => setEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={!!todo.completed}
          onChange={toggle}
        />
      </label>

      {editing ? (
        <form onSubmit={rename}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={todoInputField}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={rename}
            onKeyUp={reset}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader isActive={loading} />
    </div>
  );
};
