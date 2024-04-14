import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodoContext';
import * as todoService from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { todos, setTodos, setErrorMessage, multiLoader, titleField } =
    useContext(TodoContext);
  const [deletedTodoId, setDeletedTodoId] = useState(0);
  const [changedStatusTodo, setchangedStatusTodo] = useState(0);
  const [localLoader, setLocalLoader] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const hasLoaderOnCreation = todo.id === 0;
  const hasLoaderOnDeletion = localLoader && deletedTodoId === todo.id;
  const hasLoaderOnCleaning = multiLoader && todo.completed;
  const hasLoaderOnChangeStatus = localLoader && changedStatusTodo === todo.id;
  const hasLoaderOnUpdating = localLoader && todo.title;
  const isLoading =
    hasLoaderOnCreation ||
    hasLoaderOnDeletion ||
    hasLoaderOnCleaning ||
    hasLoaderOnChangeStatus ||
    hasLoaderOnUpdating;

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const removeTodo = () => {
    setLocalLoader(true);
    setDeletedTodoId(todo.id);
    todoService
      .deleteTodo(todo.id)
      .then(() => {
        setTodos(todos.filter(task => task.id !== todo.id));
      })
      .catch(() => {
        setErrorMessage(Errors.DeleteError);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLocalLoader(false);
        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }
        }, 0);
        setDeletedTodoId(0);
      });
  };

  const updatingTodo = () => {
    const trimedTitle = editedTitle.trim();

    if (trimedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    setLocalLoader(true);

    if (trimedTitle.length) {
      todoService
        .updateTodo({ ...todo, title: trimedTitle })
        .then(createdTodo => {
          const result = todos.map(t => {
            if (t.id === createdTodo.id) {
              return createdTodo;
            } else {
              return t;
            }
          });

          setTodos(result);
          setEditedTitle(editedTitle);
          setIsEditing(false);
        })
        .catch(() => {
          setErrorMessage(Errors.UpdateError);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        })
        .finally(() => {
          setTimeout(() => {
            if (titleField.current) {
              titleField.current.focus();
            }
          }, 0);
          setLocalLoader(false);
        });
    } else {
      removeTodo();
    }
  };

  const hideInput = () => {
    setIsEditing(false);
    updatingTodo();
  };

  const editingTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimedTitle = editedTitle.trim();

    if (trimedTitle.length) {
      updatingTodo();
    } else {
      removeTodo();
    }
  };

  const stopEditingTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      hideInput();
    }
  };

  const changeCompleteStatus = () => {
    setLocalLoader(true);
    setchangedStatusTodo(todo.id);
    todoService
      .updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(prevtodos =>
          prevtodos.map(task => (task.id === todo.id ? updatedTodo : task)),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.UpdateError);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLocalLoader(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        editing: isEditing === true,
      })}
    >
      <label className="todo__status-label">
        {''}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={changeCompleteStatus}
        />
      </label>

      {isEditing ? (
        <form onSubmit={editingTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={handleTitleChange}
            onKeyUp={stopEditingTodo}
            onBlur={hideInput}
            value={editedTitle}
            ref={titleField}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={removeTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
