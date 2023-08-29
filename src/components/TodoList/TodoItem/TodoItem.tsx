import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import * as todoService from '../../../api/todos';
import { Todo } from '../../../types/Todo';
import { useTodo } from '../../../api/useTodo';
import { Error } from '../../../types/Error';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setTodos,
    setErrorMessage,
    tempTodo,
    toBeCleared,
    setCleared,
    toggled,
    setToggled,
  } = useTodo();

  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const editRef = useRef<HTMLInputElement>(null);
  const editTimerRef = useRef<number | null>(null);

  const handleDelete = (todoId: number, errorMessage = Error.Delete) => {
    setIsTodoLoading(true);

    todoService.deleteTodo(todoId)
      .then(() => setTodos(currTodos => [...currTodos]
        .filter(currTodo => currTodo.id !== todoId)))
      .catch(() => {
        setErrorMessage(errorMessage);
      })
      .finally(() => {
        setIsTodoLoading(false);
        setCleared([]);
      });
  };

  const handleComplete = (
    completedTodo: Todo,
    errorMessage = Error.Update,
  ) => {
    setIsTodoLoading(true);

    const updated = {
      ...completedTodo,
      completed: !completedTodo.completed,
    };

    todoService.updateTodo(todo.id, updated)
      .then(updatedTodo => {
        setTodos(currentTodo => {
          const updateTodos = [...currentTodo];
          const index = updateTodos
            .findIndex(currTodo => currTodo.id === updatedTodo.id);

          updateTodos.splice(index, 1, updatedTodo);

          return updateTodos;
        });
      })
      .catch(() => setErrorMessage(errorMessage))
      .finally(() => {
        setToggled([]);
        setIsTodoLoading(false);
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

  const handleSubmit = (event: React.FormEvent, editedTodo: Todo) => {
    event.preventDefault();
    handleEdit(editedTodo);
  };

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
    if (toggled.includes(todo.id)) {
      handleComplete(todo, Error.Toggle);
    }
  }, [toggled]);

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
      className={classNames('todo', {
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
          onSubmit={(event) => handleSubmit(event, todo)}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editRef}
            value={editedTitle}
            onBlur={() => handleEdit(todo)}
            onChange={(event) => setEditedTitle(event.target.value)}
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
            className="destroy todo__remove"
            onClick={() => handleDelete(todo.id)}
          >
            &times;
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
