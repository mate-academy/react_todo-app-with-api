import cn from 'classnames';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { TodoContext } from '../TodoContext';
import { ErrorMessage } from '../types/ErrorMessage';
import { removeTodo, updateTodo } from '../api/todos';
import { Key } from '../types/Key';

type Props = {
  todo: Todo
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    todos,
    tempTodo,
    setTodos,
    setError,
    isClearCompleted,
    setIsUpdating,
    isUpdating,
    toggledTodos,
    setToggledTodos,
    isToggleAllClicked,
    isEveryTodoCompleted,
    inputRef,
  } = useContext(TodoContext);

  const [
    deletingTodo,
    setDeletingTodo,
  ] = useState<Todo | undefined>(undefined);

  const [updatingTodo, setUpdatingTodo] = useState<number | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);
  const [isToggled, setIsToggled] = useState(false);

  const todoInputRef = useRef<HTMLInputElement>(null);

  const isEqualTitle = updatedTitle.trim() === todo.title.trim();

  useEffect(() => {
    if (updatingTodo && todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [updatingTodo]);

  const handleDoubleClick = (todoId: number) => {
    setUpdatingTodo(todoId);
  };

  const handleTodoToggle = useCallback((todoId: number) => {
    setToggledTodos(todoId);
    setIsToggled(true);

    updateTodo(todoId, { completed: !todo.completed })
      .then(() => {
        const updatedTodos = todos.map((t) => {
          if (t.id === todoId) {
            return { ...t, completed: !t.completed };
          }

          return t;
        });

        setToggledTodos(null);
        setTodos(updatedTodos);
      })
      .catch(() => setError(ErrorMessage.UpdateTodo))
      .finally(() => setIsToggled(false));
  }, [setError,
    setTodos,
    todo.completed,
    setToggledTodos,
    todos]);

  const handleDelete = (todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        setTodos(todos.filter(t => t.id !== todoId));
      })
      .catch(() => setError(ErrorMessage.DeleteTodo))
      .finally(() => {
        setDeletingTodo(undefined);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });

    setDeletingTodo(todos.find(t => t.id === todoId));
  };

  const handleBlur = (todoId: number) => {
    if (updatedTitle.trim() === '') {
      handleDelete(todoId);

      return;
    }

    setIsUpdating(true);

    updateTodo(todoId, { title: updatedTitle })
      .then(() => {
        const updatedTodos = todos.map((t) => {
          if (t.id === todoId) {
            return { ...t, title: updatedTitle.trim() };
          }

          return t;
        });

        setUpdatingTodo(null);
        setTodos(updatedTodos);
      })
      .catch(() => setError(ErrorMessage.UpdateTodo))
      .finally(() => setIsUpdating(false));
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>, todoId: number,
  ) => {
    if (event.key === Key.Enter && !isEqualTitle) {
      handleBlur(todoId);
    } else if (event.key === Key.Escape || isEqualTitle) {
      setUpdatedTitle(todo.title);
      setUpdatingTodo(null);
      setIsUpdating(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={() => handleDoubleClick(todo.id)}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleTodoToggle(todo.id)}
        />
      </label>
      {(updatingTodo !== todo.id)
        ? (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title.trim()}
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
        )
        : (
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTitle}
              ref={todoInputRef}
              onKeyUp={(event) => handleKeyUp(event, todo.id)}
              onChange={(event) => setUpdatedTitle(event.target.value)}
              onBlur={() => handleBlur(todo.id)}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active': todo.id === tempTodo?.id
            || todo.id === deletingTodo?.id
            || (isClearCompleted && todo.completed)
            || (isUpdating && updatingTodo === todo.id)
            || (isToggled && toggledTodos === todo.id)
            || (isEveryTodoCompleted && isToggleAllClicked && todo.completed)
            || (!isEveryTodoCompleted && isToggleAllClicked && !todo.completed),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
