import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodosContext';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorNotification } from '../../types/ErrorNotification';

interface Props {
  todo: Todo;
  removeTodo: (todo: Todo) => void;
  isTempTodo: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo, isTempTodo, removeTodo,
}) => {
  const { title, completed, id } = todo;

  const context = useContext(TodosContext);

  const [editedTitle, setEditedTitle] = useState(title);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodoId === id) {
      inputRef.current?.focus();
    }
  }, [editingTodoId, id]);

  const {
    isLoader,
    setIsLoader,
    todos,
    setTodos,
    setErrorMessage,
  } = context;

  const handleCheckboxUpdate = () => {
    setIsLoader(id);

    const newTodo: Todo = {
      id: todo.id,
      title: todo.title,
      userId: todo.userId,
      completed: !todo.completed,
    };

    const index = todos.findIndex(item => (
      item.id === newTodo.id));

    const newTodos = [...todos];

    newTodos.splice(index, 1, newTodo);

    updateTodo(newTodo)
      .then(() => setTodos(newTodos))
      .catch(() => setErrorMessage(ErrorNotification.UpdateError))
      .finally(() => setIsLoader(null));
  };

  const handleTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setEditingTodoId(id);
    setEditedTitle(title.trim());
  };

  const updateTodoTitle = (trimmedTitle: string) => {
    setIsLoader(id);

    if (!trimmedTitle) {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(item => item.id !== id));
        })
        .catch(() => setErrorMessage(ErrorNotification.DeleteError))
        .finally(() => {
          setIsLoader(null);
          setEditingTodoId(null);
        });
    } else {
      const newTodo: Todo = {
        id: todo.id,
        title: trimmedTitle,
        userId: todo.userId,
        completed: todo.completed,
      };

      const index = todos.findIndex(item => (
        item.id === newTodo.id));

      const newTodos = [...todos];

      newTodos.splice(index, 1, newTodo);

      updateTodo(newTodo)
        .then(() => setTodos(newTodos))
        .catch(() => setErrorMessage(ErrorNotification.UpdateError))
        .finally(() => {
          setIsLoader(null);
          setEditingTodoId(null);
        });
    }
  };

  const handleOnBlur = () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle !== title) {
      updateTodoTitle(trimmedTitle);
    } else {
      setEditedTitle(title);
      setEditingTodoId(null);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      if (editedTitle.trim() === title) {
        setEditingTodoId(null);
      } else {
        updateTodoTitle(editedTitle.trim());
      }
    } else if (event.key === 'Escape') {
      setEditedTitle(title);
      setEditingTodoId(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
        editing: editingTodoId === id,
      })}
      onDoubleClick={handleDoubleClick}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheckboxUpdate}
        />
      </label>

      {
        editingTodoId === id && (
          <form onSubmit={event => event.preventDefault}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              ref={inputRef}
              onChange={handleTitleChange}
              onBlur={handleOnBlur}
              onKeyDown={handleKeyDown}
            />
          </form>
        )
      }

      {
        editingTodoId !== id && (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => removeTodo(todo)}
            >
              ×
            </button>
          </>
        )
      }

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active': isTempTodo || isLoader === todo.id,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
