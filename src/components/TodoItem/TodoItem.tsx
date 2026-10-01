/* eslint-disable jsx-a11y/label-has-associated-control */

import cn from 'classnames';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import * as client from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  setTodos: Dispatch<SetStateAction<Todo[] | undefined>>;
  setError: (error: string) => void;
  deletingTodoIds: number[];
  setDeletingTodoIds: Dispatch<SetStateAction<number[]>>;
  updatingTodoIds: number[];
  setUpdatingTodoIds: Dispatch<SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setError,
  deletingTodoIds,
  setDeletingTodoIds,
  updatingTodoIds,
  setUpdatingTodoIds,
}) => {
  const [isTodoEditing, setIsTodoEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(todo.title);

  const editingRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTodoEditing) {
      editingRef.current?.focus();
    }
  }, [isTodoEditing]);

  function deleteTodo() {
    setDeletingTodoIds(previousIds => [...previousIds, todo.id]);

    client
      .deleteTodo(todo.id)
      .then(() => {
        setTodos(previousTodos =>
          previousTodos?.filter(item => item.id !== todo.id),
        );
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setDeletingTodoIds([]));
  }

  function saveEdit(newTitle: string) {
    const trimmedTitle = newTitle.trim();

    switch (trimmedTitle) {
      case todo.title:
        setIsTodoEditing(false);
        break;
      case '':
        deleteTodo();
        break;
      default:
        setUpdatingTodoIds(previous => [...previous, todo.id]);

        client
          .editTodo(todo.id, {
            ...todo,
            title: trimmedTitle,
          })
          .then(updatedTodo => {
            setTodos(previousTodos =>
              previousTodos?.map(item => {
                if (item.id === updatedTodo.id) {
                  return updatedTodo;
                }

                return item;
              }),
            );
            setIsTodoEditing(false);
          })
          .catch(() => setError('Unable to update a todo'))
          .finally(() =>
            setUpdatingTodoIds(previousIds =>
              previousIds.filter(id => id !== todo.id),
            ),
          );
    }

    return;
  }

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => {
            setUpdatingTodoIds([todo.id]);

            client
              .editTodo(todo.id, {
                ...todo,
                completed: event.target.checked,
              })
              .then(updatedTodo =>
                setTodos(previousTodos =>
                  previousTodos?.map(item => {
                    if (item.id === updatedTodo.id) {
                      return updatedTodo;
                    }

                    return item;
                  }),
                ),
              )
              .catch(() => setError('Unable to update a todo'))
              .finally(() => setUpdatingTodoIds([]));
          }}
        />
      </label>

      {!isTodoEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsTodoEditing(true);
          }}
        >
          {todo.title}
        </span>
      )}

      {isTodoEditing && (
        <form
          onSubmit={event => {
            event.preventDefault();

            saveEdit(editTitle);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={editingRef}
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={() => {
              saveEdit(editTitle);
            }}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditTitle(todo.title);
                setIsTodoEditing(false);
              }
            }}
          />
        </form>
      )}

      {!isTodoEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo()}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active':
            deletingTodoIds.includes(todo.id) ||
            updatingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
