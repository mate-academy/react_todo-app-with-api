/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import { Todo } from '../types/Todo';

import {
  DeletingTodosIdsContext,
  ErrorContext,
  TodosContext,
  UpdatingTodosIdsContext,
} from '../providers/TodosProvider';
import { FocusContext } from '../providers/FocusProvider';
import { deleteTodoItem } from '../utils/deleteTodoItem';
import { normalizeSpaces } from '../utils/normalize';
import { updateTodoItem } from '../utils/updateTodoItem';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const { setTodos } = useContext(TodosContext);
  const { setErrorMessage } = useContext(ErrorContext);
  const { setFocus } = useContext(FocusContext);
  const { deletingTodosIds, setDeletingTodosIds } = useContext(
    DeletingTodosIdsContext,
  );
  const { updatingTodosIds, setUpdatingTodosIds } = useContext(
    UpdatingTodosIdsContext,
  );

  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [isEditing]);

  // need to normalize and update the title on server
  const handleUpdateTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTitle(e.target.value);
    },
    [],
  );

  const handleDeleteTodo = useCallback(() => {
    setDeletingTodosIds([...deletingTodosIds, todo.id]);
    const originalTitle = todo.title;
    const isEditingNow = isEditing;

    deleteTodoItem({
      todoId: todo.id,
      setTodos,
      setErrorMessage,
      setDeletingTodosIds,
      setFocus,
    }).catch(() => {
      setNewTitle(originalTitle);
      if (isEditingNow) {
        setIsEditing(true);
      }
    });
  }, [
    todo.id,
    todo.title,
    isEditing,
    deletingTodosIds,
    setTodos,
    setErrorMessage,
    setDeletingTodosIds,
    setFocus,
  ]);

  const modifyTodo = useCallback(
    (waitingTodo: Todo) => {
      setUpdatingTodosIds(prevUpdatingIds => {
        return [...prevUpdatingIds, waitingTodo.id];
      });

      return updateTodoItem({
        todo: waitingTodo,
        setTodos,
        setErrorMessage,
        setUpdatingTodosIds,
      });
    },
    [setTodos, setErrorMessage, setUpdatingTodosIds],
  );

  const handleUpdateTodoTitle = useCallback(() => {
    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const normalizedTitle = normalizeSpaces(newTitle);

    setNewTitle(normalizedTitle);

    if (!normalizedTitle) {
      handleDeleteTodo();
    } else if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    } else {
      const originalTitle = todo.title;

      modifyTodo({
        ...todo,
        title: normalizedTitle,
      }).catch(() => {
        setNewTitle(originalTitle);
        setIsEditing(true);
      });
    }

    setIsEditing(false);
  }, [handleDeleteTodo, newTitle, todo, modifyTodo]);

  const handleSumbitUpdatingTodoTitle = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleUpdateTodoTitle();
    },
    [handleUpdateTodoTitle],
  );

  const handleUpdateTodoCompleted = useCallback(() => {
    modifyTodo({
      ...todo,
      completed: !todo.completed,
    });
  }, [todo, modifyTodo]);

  const handleCancelUpdate = useCallback(() => {
    setIsEditing(false);
    setNewTitle(todo.title);
  }, [todo.title]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleUpdateTodoCompleted}
        />
      </label>

      {/* This form is shown instead of the title and remove button */}
      {isEditing ? (
        <form onSubmit={handleSumbitUpdatingTodoTitle}>
          <input
            ref={todoInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleUpdateTitle}
            onBlur={handleUpdateTodoTitle}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                handleCancelUpdate();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {newTitle}
          </span>

          {/*  Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      {/* add class 'is active while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todo.id === 0 ||
            deletingTodosIds.includes(todo.id) ||
            updatingTodosIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
