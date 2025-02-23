import React, { useContext, useState, useEffect } from 'react';
import cn from 'classnames';

import { DispatchContext } from '../store/TodoContext';
import { StateContext } from '../store/TodoContext';
import { useErrorMessage } from './useErrorMessage';
import { deleteTodo, updateTodo } from '../api/todos';

import { Todo } from '../types/Todo';
import {
  setInputFocuseAction,
  deleteTodoAction,
  setLoadingItemIdsAction,
  setTodosAction,
  toggleTodoStatusAction,
} from './todoActions';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { loadingItemIds, todos } = useContext(StateContext);
  const handleError = useErrorMessage();
  const dispatch = useContext(DispatchContext);

  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const editingInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editingInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleToggleTodoStatus = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    updateTodo(updatedTodo)
      .then(() => {
        dispatch(
          setLoadingItemIdsAction(loadingItemIds.filter(id => id !== todo.id)),
        );
        dispatch(toggleTodoStatusAction(updatedTodo.id));
      })
      .catch(() => {
        handleError('Unable to update a todo');
        dispatch(setInputFocuseAction(true));
        dispatch(
          setLoadingItemIdsAction(loadingItemIds.filter(id => id !== todo.id)),
        );
      });

    dispatch(setLoadingItemIdsAction([...loadingItemIds, todo.id]));
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        dispatch(deleteTodoAction(todoId));
        dispatch(setLoadingItemIdsAction([...loadingItemIds, todoId]));
        dispatch(setInputFocuseAction(true));
      })
      .catch(() => {
        handleError('Unable to delete a todo');
        editingInputRef.current?.focus();
      })
      .finally(() => {
        dispatch(
          setLoadingItemIdsAction(loadingItemIds.filter(id => id !== todoId)),
        );
      });

    dispatch(setLoadingItemIdsAction([...loadingItemIds, todoId]));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    try {
      dispatch(setLoadingItemIdsAction([...loadingItemIds, todo.id]));

      const updatedTodo = await updateTodo({ ...todo, title: trimmedTitle });

      dispatch(
        setTodosAction([
          ...todos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        ]),
      );

      setIsEditing(false);
    } catch (error) {
      handleError('Unable to update a todo');
      editingInputRef.current?.focus();
    } finally {
      dispatch(setLoadingItemIdsAction([]));
    }
  };

  const handleEscapePress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setTodoTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label" aria-label="Todo status checkbox">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodoStatus}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={todoTitle}
            onChange={event => setTodoTitle(event.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyUp={handleEscapePress}
            ref={editingInputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingItemIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
