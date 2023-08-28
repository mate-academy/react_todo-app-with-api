import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import * as todoService from '../../api/todos';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setTodos,
    setErrorMessage,
    tempTodo,
    toBeCleared,
    setToBeCleared,
    toBeToggled,
    setToBeToggled,
  } = useContext(TodosContext);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleComplete = (completedTodo: Todo, errorMessage = Error.Update) => {
    setIsTodoLoading(true);

    const updated = {
      ...completedTodo,
      completed: !completedTodo.completed,
    };

    todoService.updateTodo(todo.id, updated)
      .then(updatedTodo => {
        setTodos(currTodos => {
          const updatedTodos = [...currTodos];
          const index = updatedTodos
            .findIndex(currTodo => currTodo.id === updatedTodo.id);

          updatedTodos.splice(index, 1, updatedTodo);

          return updatedTodos;
        });
      })
      .catch(() => setErrorMessage(errorMessage))
      .finally(() => {
        setToBeToggled([]);
        setIsTodoLoading(false);
      });
  };

  const handleDelete = (todoId: number, errorMessage = Error.Delete) => {
    setIsTodoLoading(true);

    todoService.deleteTodo(todoId)
      .then(() => setTodos(currTodos => [...currTodos]
        .filter(currTodo => currTodo.id !== todoId)))
      .catch(() => setErrorMessage(errorMessage))
      .finally(() => {
        setIsTodoLoading(false);
        setToBeCleared([]);
      });
  };

  const handleEdit = (editedTodo: Todo) => {
    if (editedTitle === editedTodo.title) {
      setIsEditable(false);

      return;
    }

    if (editedTitle.trim()) {
      const edited = {
        ...editedTodo,
        title: editedTitle,
      };

      setIsTodoLoading(true);

      todoService.updateTodo(todo.id, edited)
        .then(updatedTodo => {
          setIsEditable(false);
          setTodos(currTodos => {
            const updatedTodos = [...currTodos];
            const index = updatedTodos
              .findIndex(currTodo => currTodo.id === updatedTodo.id);

            updatedTodos.splice(index, 1, updatedTodo);

            return updatedTodos;
          });
        })
        .catch(() => {
          setErrorMessage(Error.Update);
          setEditedTitle(editedTodo.title);
        })
        .finally(() => setIsTodoLoading(false));
    } else {
      handleDelete(editedTodo.id);
    }

    setIsEditable(false);
  };

  const handleSubmit = (e: React.FormEvent, editedTodo: Todo) => {
    e.preventDefault();
    handleEdit(editedTodo);
  };

  const handleKeyUp = (e: React.KeyboardEvent, editedTodo: Todo) => {
    if (e.key === 'Escape') {
      setIsEditable(false);

      if (!editedTitle.trim()) {
        handleDelete(editedTodo.id);
      }
    }
  };

  const editRef = useRef<HTMLInputElement>(null);
  const editTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (tempTodo) {
      setIsTodoLoading(true);
    }
  }, []);

  useEffect(() => {
    if (toBeCleared.includes(todo.id)) {
      handleDelete(todo.id, Error.Clear);
    }
  }, [toBeCleared]);

  useEffect(() => {
    if (toBeToggled.includes(todo.id)) {
      handleComplete(todo, Error.Toggle);
    }
  }, [toBeToggled]);

  useEffect(() => {
    if (editTimerRef.current) {
      window.clearTimeout(editTimerRef.current);
    }

    if (isEditable) {
      editTimerRef.current = window.setTimeout(() => {
        editRef.current?.focus();
      }, 0);
    }

    return () => {
      if (editTimerRef.current) {
        window.clearTimeout(editTimerRef.current);
      }
    };
  }, [isEditable]);

  return (
    <li
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleComplete(todo)}
        />
      </label>

      {isEditable ? (
        <form
          onSubmit={(e) => handleSubmit(e, todo)}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editRef}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={() => handleEdit(todo)}
            onKeyUp={(e) => handleKeyUp(e, todo)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditable(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn('modal overlay', {
          'is-active': isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
