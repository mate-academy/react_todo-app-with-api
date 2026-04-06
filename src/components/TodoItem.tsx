/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type TodoItemProps = {
  todo: Todo;
  processingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setError: (message: string) => void;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  processingIds,
  setTodos,
  setProcessingIds,
  setError,
  editingTodoId,
  setEditingTodoId,
  editingTitle,
  setEditingTitle,
  inputRef,
}) => {
  const handleDelete = async (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todoItem => todoItem.id !== id));

      setTimeout(() => {
        inputRef.current?.focus();
      });
    } catch {
      setError(ErrorMessage.DeleteTodo);

      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    }
  };

  const handleToggle = async (todoItem: Todo) => {
    setProcessingIds(prev => [...prev, todoItem.id]);

    try {
      await todoService.updateTodo(todoItem.id, {
        completed: !todoItem.completed,
      });
      setTodos(prev =>
        prev.map(t =>
          t.id === todoItem.id ? { ...t, completed: !t.completed } : t,
        ),
      );
    } catch {
      setError(ErrorMessage.UpdateTodo);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoItem.id));
    }
  };

  const saveTodo = async (todoItem: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (!trimmedTitle) {
      handleDelete(todoItem.id);

      return;
    }

    if (trimmedTitle === todoItem.title) {
      setEditingTodoId(null);

      return;
    }

    setProcessingIds(prev => [...prev, todoItem.id]);

    try {
      await todoService.updateTodo(todoItem.id, { title: trimmedTitle });
      setTodos(prev =>
        prev.map(t =>
          t.id === todoItem.id ? { ...t, title: trimmedTitle } : t,
        ),
      );
      setEditingTodoId(null);
    } catch {
      setError(ErrorMessage.UpdateTodo);

      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoItem.id));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todoItem: Todo,
  ) => {
    if (e.key === 'Enter') {
      saveTodo(todoItem);
    } else if (e.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo)}
        />
      </label>

      {editingTodoId === todo.id ? (
        <input
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editingTitle}
          placeholder="Empty todo will be deleted"
          autoFocus
          onChange={e => setEditingTitle(e.target.value)}
          onBlur={() => saveTodo(todo)}
          onKeyDown={e => handleKeyDown(e, todo)}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingTodoId(todo.id);
            setEditingTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {editingTodoId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          x
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${processingIds.includes(todo.id) ? 'is-active' : ''}`}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
