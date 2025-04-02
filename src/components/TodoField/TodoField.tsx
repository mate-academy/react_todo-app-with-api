/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  setIsLoadedIDs: (id: number[]) => void;
  isLoadedIDs: number[];
  changeCompleted: (todoToChange: Todo) => void;
  deleteTodo?: (id: number) => Promise<void>;
  changeTodo?: (todoToChange: Todo, newTitle: string) => Promise<void>;
  editingTodoId: number | null;
  setEditingTodoId: (value: number | null) => void;
};

// eslint-disable-next-line react/display-name
export const TodoField: React.FC<Props> = React.memo(
  ({
    todo,
    isLoadedIDs,
    setIsLoadedIDs,
    changeCompleted,
    deleteTodo = () => {},
    changeTodo = () => {},
    setEditingTodoId,
    editingTodoId,
  }) => {
    const { id, title, completed: isCompleted } = todo;

    const [todoTitle, setTodoTitle] = useState(title);

    const inputRef = useRef<HTMLInputElement>(null);
    const isEditing = useMemo(() => editingTodoId === id, [editingTodoId]);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    const handleDeleteTodo = useCallback((todoId: number) => {
      setIsLoadedIDs([todoId, ...isLoadedIDs]);
      deleteTodo(todoId);
    }, []);

    const handleChangeCompleted = useCallback((todoToChange: Todo) => {
      setIsLoadedIDs([todoToChange.id, ...isLoadedIDs]);
      changeCompleted(todoToChange);
    }, []);

    const handleEditTodo = useCallback(
      (event: React.FormEvent<HTMLFormElement>, newTitle: string) => {
        event.preventDefault();

        if (newTitle.trim() === title) {
          setEditingTodoId(null);
        }

        setIsLoadedIDs([id, ...isLoadedIDs]);

        if (!newTitle.trim()) {
          deleteTodo(id)
            ?.then(() => {
              setEditingTodoId(null);
            })
            .catch(() => {
              setEditingTodoId(id);
            });

          return;
        }

        changeTodo(todo, newTitle.trim())
          ?.then(() => {
            setEditingTodoId(null);
          })
          .catch(() => {
            setEditingTodoId(id);
          });
      },
      [],
    );

    const handleSelectTodo = useCallback(() => {
      setEditingTodoId(id);
      setTodoTitle(title);
    }, []);

    return (
      <div data-cy="Todo" className={cn('todo', { completed: isCompleted })}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={isCompleted}
            onChange={() => handleChangeCompleted(todo)}
          />
        </label>

        {isEditing ? (
          <form
            onBlur={event => handleEditTodo(event, todoTitle)}
            onSubmit={event => handleEditTodo(event, todoTitle)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditingTodoId(null);
              }
            }}
          >
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={event => setTodoTitle(event.target.value)}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleSelectTodo()}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        {/* 'is-active' class puts this modal on top of the todo */}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoadedIDs.includes(id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
