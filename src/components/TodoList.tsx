import classNames from 'classnames';
import { Todo, TypeTodoList } from '../types/Todo';
import React, { useEffect, useRef, useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { sendErrorMessage } from './ErrorsUnderFooter';

export const TodoList: React.FC<TypeTodoList> = ({
  filteredTodoList,
  deletingTodos,
  handleToggleCompletion,
  handleDeleteTodo,
  setTodoList,
  setErrorMessage,
  setDeletingTodos,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);
  const refInputUpdate = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (refInputUpdate.current) {
      refInputUpdate.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditedTitle(
          filteredTodoList.find(t => t.id === editingId)?.title || '',
        );
        setEditingId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingId, filteredTodoList]);

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditedTitle(todo.title);
  };

  const handleEditSubmit = async (editingTodo: Todo) => {
    if (editedTitle === editingTodo.title && editingId === editingTodo.id) {
      setEditingId(null);

      return;
    }

    const updatedTodo = { ...editingTodo, title: editedTitle.trim() };

    if (editedTitle.trim() === '') {
      setDeletingTodos(prev => [...prev, editingTodo.id]);
      try {
        await deleteTodo(updatedTodo.id);
        setTodoList(prevTodoList =>
          prevTodoList.filter(todo => todo.id !== updatedTodo.id),
        );
        setEditingId(null);
        setEditedTitle('');
      } catch (error) {
        sendErrorMessage('Unable to update a todo', setErrorMessage);
      } finally {
        setDeletingTodos(prev => prev.filter(id => id !== editingTodo.id));
      }
    } else {
      setUpdatingTodos(prev => [...prev, editingTodo.id]);
      try {
        const updatedTodoFromApi = await updateTodo(updatedTodo);

        setTodoList(prevTodoList =>
          prevTodoList.map(t =>
            t.id === updatedTodoFromApi.id ? updatedTodoFromApi : t,
          ),
        );
        setEditingId(null);
        setEditedTitle('');
      } catch (error) {
        sendErrorMessage('Unable to update a todo', setErrorMessage);
      } finally {
        setUpdatingTodos(prev => prev.filter(id => id !== editingTodo.id));
      }
    }
  };

  return (
    <>
      {filteredTodoList.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: completed,
              'todo--loading':
                deletingTodos.includes(id) || updatingTodos.includes(id),
            })}
            key={todo.id}
          >
            {/* eslint-disable-next-line */}
            <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                id={`todo-status-${todo.id}`}
                onChange={() => handleToggleCompletion(id)}
                disabled={deletingTodos.includes(id)}
              />
            </label>

            {editingId !== id ? (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleEditStart(todo)}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(id)}
                  disabled={deletingTodos.includes(id)}
                >
                  ×
                </button>
              </>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleEditSubmit(todo);
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  value={editedTitle}
                  ref={refInputUpdate}
                  onChange={e => setEditedTitle(e.target.value)}
                  onBlur={() => handleEditSubmit(todo)}
                  placeholder="Empty todo will be deleted"
                />
              </form>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active':
                  deletingTodos.includes(id) || updatingTodos.includes(id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </>
  );
};
