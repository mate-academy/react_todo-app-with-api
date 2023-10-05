import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../TodoContext';
import * as PostService from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessageEnum';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({
  todo,
}) => {
  const {
    todos,
    setTodos,
    handleDelete,
    changingId,
    setErrorOccured,
  } = useContext(TodoContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(changingId.includes(todo.id));
  }, [changingId]);

  const [dbClicked, setDbClicked] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleUpdateTodo = () => {
    setDbClicked(false);
    setIsLoading(true);

    if (!newTitle.trim()) {
      handleDelete(todo);

      return;
    }

    const updatedTodo = {
      ...todo,
      title: newTitle,
    };

    PostService.updateTodo(updatedTodo)
      .then(() => {
        setTodos(
          todos.map(currentTodo => {
            return currentTodo.id === updatedTodo.id
              ? { ...currentTodo, title: newTitle }
              : currentTodo;
          }),
        );
      })
      .catch(() => {
        setErrorOccured(ErrorMessage.noUpdateTodo);
        setTimeout(() => {
          setErrorOccured('');
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  };

  const saveChanges = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleUpdateTodo();
    }

    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setDbClicked(false);
    }
  };

  const handleChecked = () => {
    setIsLoading(true);

    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    PostService.updateTodo(newTodo)
      .then(() => {
        setTodos(todos.map(currentTodo => (
          currentTodo.id === newTodo.id
            ? { ...currentTodo, completed: !currentTodo.completed }
            : currentTodo
        )));
      })
      .catch(() => {
        setErrorOccured(ErrorMessage.noUpdateTodo);
        setTimeout(() => {
          setErrorOccured('');
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  };

  const editingRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingRef.current && dbClicked) {
      editingRef.current.focus();
    }
  }, [dbClicked]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => setDbClicked(true)}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChecked}
        />
      </label>

      {!dbClicked && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo)}
          >
            ×
          </button>
        </>
      )}

      {dbClicked && (
        <form
          onBlur={handleUpdateTodo}
          onSubmit={handleUpdateTodo}
        >
          <label className="todo__status-label">
            <input
              type="text"
              data-cy="TodoTitleField"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onKeyDown={saveChanges}
              onChange={(event) => setNewTitle(event.target.value)}
              ref={editingRef}
            />
          </label>
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          {
            'is-active': isLoading,
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
