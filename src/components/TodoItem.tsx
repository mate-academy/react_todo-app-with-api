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

  const handleDoubleClick = () => {
    setUpdatingTodo(todo.id);
    setUpdatedTitle(todo.title);
  };

  const handleTodoToggle = useCallback(() => {
    setToggledTodos(todo.id);
    setIsToggled(true);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(() => {
        setTodos((prevTodos) => {
          return prevTodos.map((currentTodo) => {
            if (currentTodo.id === todo.id) {
              return { ...currentTodo, completed: !currentTodo.completed };
            }

            return currentTodo;
          });
        });

        setToggledTodos(null);
      })
      .catch(() => setError(ErrorMessage.UpdateTodo))
      .finally(() => setIsToggled(false));
  }, [setError,
    setTodos,
    todo.completed,
    todo.id,
    setToggledTodos,
  ]);

  const handleDelete = () => {
    removeTodo(todo.id)
      .then(() => {
        setTodos(todos.filter(currentTodo => currentTodo.id !== todo.id));
      })
      .catch(() => setError(ErrorMessage.DeleteTodo))
      .finally(() => {
        setDeletingTodo(undefined);
        inputRef.current?.focus();
      });

    setDeletingTodo(todos.find(currentTodo => currentTodo.id === todo.id));
  };

  const handleBlur = () => {
    if (updatedTitle.trim() === '') {
      handleDelete();

      return;
    }

    if (!isEqualTitle) {
      setIsUpdating(true);

      updateTodo(todo.id, { title: updatedTitle })
        .then(() => {
          const updatedTodos = todos.map((currentTodo) => {
            if (currentTodo.id === todo.id) {
              return { ...currentTodo, title: updatedTitle.trim() };
            }

            return currentTodo;
          });

          setUpdatingTodo(null);
          setTodos(updatedTodos);
        })
        .catch(() => setError(ErrorMessage.UpdateTodo))
        .finally(() => setIsUpdating(false));
    } else {
      setUpdatingTodo(null);
    }
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === Key.Enter) {
      handleBlur();
    } else if (event.key === Key.Escape) {
      setUpdatedTitle(todo.title);
      setUpdatingTodo(null);
      setIsUpdating(false);
    }
  };

  const isLoading = todo.id === tempTodo?.id
  || todo.id === deletingTodo?.id
  || (isClearCompleted && todo.completed)
  || (isUpdating && updatingTodo === todo.id)
  || (isToggled && toggledTodos === todo.id)
  || (isEveryTodoCompleted && isToggleAllClicked && todo.completed)
  || (!isEveryTodoCompleted && isToggleAllClicked && !todo.completed);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleTodoToggle()}
        />
      </label>
      {(updatingTodo !== todo.id)
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleDoubleClick()}
            >
              {todo.title.trim()}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete()}
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
              onKeyUp={(event) => handleKeyUp(event)}
              onChange={(event) => setUpdatedTitle(event.target.value)}
              onBlur={() => handleBlur()}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
