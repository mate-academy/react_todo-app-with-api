import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import * as todoService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../../types/TempTodo';
import { TodoContext } from '../../context/TodoContext';
import { Errors } from '../../types/Errors';
import { delay } from '../../utils/delay';
import { focusInputField } from '../../utils/focusInputField';

type Props = {
  todo: Todo | TempTodo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, setErrorMessage, updatingTodos } = useContext(TodoContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const deleteTodoItem = async (todoId: number) => {
    setIsLoading(true);

    await delay(100);

    todoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(Errors.DeleteError);

        if (editInputRef.current) {
          editInputRef.current.focus();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateTodo = async (updatedTodo: Todo) => {
    setIsLoading(true);

    await delay(100);

    todoService
      .updateTodo(updatedTodo)
      .then(() => {
        setTodos(prev =>
          prev.map(t =>
            t.id === todo.id ? { ...t, completed: !t.completed } : t,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.UpdateError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    focusInputField(editInputRef);
  };

  const handleSave = async () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === '') {
      deleteTodoItem(todo.id);
    } else if (trimmedTitle !== todo.title) {
      setIsLoading(true);

      await delay(100);

      todoService
        .updateTodo({
          ...todo,
          title: trimmedTitle,
        })
        .then(updatedTodo => {
          setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
          setEditTitle(trimmedTitle);
          setIsEditing(false);
        })
        .catch(() => {
          setErrorMessage(Errors.UpdateError);

          if (editInputRef.current) {
            editInputRef.current.focus();
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={() =>
              updateTodo({ ...todo, completed: !todo.completed } as Todo)
            }
            checked={todo.completed}
          />
        </label>

        {isEditing ? (
          <form
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editInputRef}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyUp={handleKeyUp}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {editTitle}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodoItem(todo.id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active':
              todo.id === 0 || isLoading || updatingTodos.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
