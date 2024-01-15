import React, {
  useCallback,
  useContext, useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { GlobalContext } from '../GlobalContextProvider';
import * as todosApi from '../../api/todos';
import { Errors } from '../../types/Errors';

interface Props {
  todo: Todo;
  editingTodoId?: number | null;
  setEditingTodoId?: (arg: number | null) => void;
  titleInput?: React.RefObject<HTMLInputElement>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  editingTodoId = null,
  setEditingTodoId = () => {},
  titleInput,
}) => {
  const {
    todos,
    setTodos,
    selectedTodosIds,
    setErrorMessage,
    setSelectedTodosIds,
  } = useContext(GlobalContext);
  const { title, id, completed } = todo;
  const [isLoading, setIsLoading] = useState(
    selectedTodosIds.includes(id),
  );
  const [editTitle, setEditTitle] = useState(title);
  const [todoStatus, setTodoStatus] = useState(completed);
  const isEditing = useMemo(() => editingTodoId === id, [editingTodoId, id]);
  const textField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoStatus !== completed) {
      setTodoStatus(completed);
    }
  }, [todoStatus, completed]);

  useEffect(() => {
    setIsLoading(selectedTodosIds.includes(id));
  }, [selectedTodosIds, id]);

  useEffect(() => {
    if (isEditing) {
      textField.current?.focus();
    }
  }, [isEditing]);

  const deleteTodo = useCallback(() => {
    setSelectedTodosIds(idsToLoad => [...idsToLoad, id]);

    return todosApi.deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(item => item.id !== id));
        titleInput?.current?.focus();
      })
      .catch(() => setErrorMessage(Errors.deleteTodoError))
      .finally(() => setSelectedTodosIds(idsToLoad => {
        return idsToLoad.filter(itemId => itemId !== id);
      }));
  }, [
    id,
    setSelectedTodosIds,
    setTodos,
    todos,
    setErrorMessage,
    titleInput,
  ]);

  const handleStatusChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedTodosIds(idsToLoad => [...idsToLoad, id]);

      todosApi.updateTodo({ ...todo, completed: event.target.checked })
        .then(updatedTodo => {
          setTodoStatus(updatedTodo.completed);
          setTodos((currentTodos) => currentTodos.map(item => {
            if (item.id !== id) {
              return item;
            }

            return updatedTodo;
          }));
        })
        .catch((err) => {
          setErrorMessage(Errors.updateTodoError);

          return err;
        })
        .finally(() => {
          setSelectedTodosIds(idsToLoad => {
            return idsToLoad.filter(itemId => itemId !== id);
          });
        });
    },
    [
      id,
      setSelectedTodosIds,
      setTodos,
      setErrorMessage,
      todo,
    ],
  );

  const handleEditTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditTitle(event.target.value);
    },
    [],
  );

  const cancelEdition = useCallback(() => {
    setEditTitle(title);
    setEditingTodoId(null);
  }, [setEditTitle, setEditingTodoId, title]);

  const handleEscapeClick = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEdition();
    }
  }, [cancelEdition]);

  const showEditField = useCallback(() => {
    setEditingTodoId(id);
  }, [setEditingTodoId, id]);

  const updateTitle = useCallback((event?: React.FormEvent) => {
    event?.preventDefault();
    setSelectedTodosIds(idsToLoad => [...idsToLoad, id]);

    const newTodo = { ...todo, title: editTitle.trim() };

    if (editTitle.trim() === title) {
      cancelEdition();

      return;
    }

    if (editTitle.trim()) {
      todosApi.updateTodo(newTodo)
        .then((updatedTodo) => {
          setTodos(tasks => tasks.map(task => {
            if (task.id === updatedTodo.id) {
              return updatedTodo;
            }

            return task;
          }));
          setEditingTodoId(null);
        })
        .catch((err) => {
          setErrorMessage(Errors.updateTodoError);

          return err;
        })
        .finally(() => {
          setSelectedTodosIds(idsToLoad => {
            return idsToLoad.filter(itemId => itemId !== id);
          });
        });
    } else {
      deleteTodo();
    }
  }, [
    editTitle,
    setErrorMessage,
    todo,
    id,
    setTodos,
    setSelectedTodosIds,
    setEditingTodoId,
    cancelEdition,
    title,
    deleteTodo,
  ]);

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', {
        completed: todoStatus,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoStatus}
          onChange={handleStatusChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={updateTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={textField}
            disabled={isLoading}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleEditTitleChange}
            onKeyUp={handleEscapeClick}
            onBlur={updateTitle}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={showEditField}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isLoading}
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
