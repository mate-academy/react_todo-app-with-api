import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GlobalContex } from '../TodoContext';
import { Todo } from '../types/Todo';
import { TodoErrors } from '../types/TodoErrors';

const ESC = 'Escape';

type TodoItemProps = {
  todo: Todo | Omit<Todo, 'userId'>;
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { id, title, completed } = todo;

  const {
    todos,
    setTodos,
    setError,
    deleteTodoItem,
    updateTodoItem,
    isLoading,
    isAllUpdating,
    isCompletedRemoving,
    setIsTitleOnFocus,
  } = useContext(GlobalContex);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const editTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => editTitleRef.current?.focus(), [isEditFormVisible]);

  const handleTodoStatusChange = () => {
    setIsUpdating(true);

    const currentTodo = todos.find(todoItem => todoItem.id === id);

    if (currentTodo) {
      const data = { completed: !currentTodo.completed };

      updateTodoItem(id, data)
        .then(() => {
          setTodos(todos.map(todoItem => {
            if (todoItem.id === id) {
              return {
                ...todoItem,
                completed: !todoItem.completed,
              };
            }

            return todoItem;
          }));
        })
        .catch(() => setError(TodoErrors.Update))
        .finally(() => setIsUpdating(false));
    }
  };

  const handleDeleteTodoClick = () => {
    setIsRemoving(true);
    setIsTitleOnFocus(false);

    deleteTodoItem(id)
      .then(res => {
        if (res) {
          setTodos(todos.filter(todoItem => todoItem.id !== id));
        }
      })
      .catch(() => setError(TodoErrors.Delete))
      .finally(() => {
        setIsTitleOnFocus(true);
        setIsRemoving(false);
      });
  };

  const saveTitle = (value: string) => {
    setIsTitleOnFocus(false);

    if (value.trim()) {
      const data = { title: value.trim() };

      setIsUpdating(true);

      updateTodoItem(id, data)
        .then(() => {
          setTodos(todos
            .map(todoItem => {
              if (todoItem.id === id) {
                return { ...todoItem, title: value.trim() };
              }

              return todoItem;
            }));

          setIsEditFormVisible(false);
        })
        .catch(() => setError(TodoErrors.Update))
        .finally(() => {
          setIsUpdating(false);
          setIsTitleOnFocus(true);
        });

      setEditTitle(value.trim());
    } else {
      setIsRemoving(true);

      deleteTodoItem(id)
        .then(() => {
          setTodos(todos.filter(todoItem => todoItem.id !== id));
          setIsEditFormVisible(false);
        })
        .catch(() => setError(TodoErrors.Delete))
        .finally(() => {
          setIsRemoving(false);
          setIsTitleOnFocus(true);
        });
    }
  };

  const handleTodoTitleBlur = () => {
    if (editTitleRef.current) {
      saveTitle(editTitleRef.current.value);
    }
  };

  const handleTodoTitleKeyUp = (
    event: React.KeyboardEvent,
  ) => {
    if (event.key === ESC) {
      setEditTitle(title);
      setIsEditFormVisible(false);
    }
  };

  const handleTodoTitleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (editTitleRef.current) {
      saveTitle(editTitleRef.current.value);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoStatusChange}
        />
      </label>

      {isEditFormVisible
        ? (
          <form onSubmit={handleTodoTitleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              onChange={(event) => setEditTitle(event.target.value)}
              onKeyUp={handleTodoTitleKeyUp}
              onBlur={handleTodoTitleBlur}
              value={editTitle}
              ref={editTitleRef}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditFormVisible(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDeleteTodoClick}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': (isLoading && !id)
            || (isRemoving && id)
            || (isUpdating && id)
            || (isAllUpdating && id)
            || (isCompletedRemoving && completed),
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
