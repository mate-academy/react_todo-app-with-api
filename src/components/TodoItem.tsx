/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { updateTodo, deleteTodo } from '../api/todos';

interface TodoItemProps {
  todo: Todo;
  haveId: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onDeleteTodo: (todoId: number) => void;
  onError: (message: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  haveId,
  setTodos,
  onDeleteTodo,
  onError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);

  const todoItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        saveTitle();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        todoItemRef.current &&
        !todoItemRef.current.contains(e.target as Node)
      ) {
        saveTitle();
      }
    };

    window.addEventListener('keyup', handleEsc);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keyup', handleEsc);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [newTitle, todo.title]);

  const handleToggle = async () => {
    setIsSaving(true);
    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      await updateTodo(updatedTodo);
      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch {
      onError('Unable to update the todo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
      onDeleteTodo(todo.id);
    } catch {
      onError('Unable to delete the todo');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const saveTitle = async () => {
    if (newTitle.trim() === '') {
      try {
        await deleteTodo(todo.id);
        onDeleteTodo(todo.id);
      } catch {
        onError('Unable to delete the todo');
      }

      return;
    }

    if (newTitle.trim() !== todo.title) {
      setIsSaving(true);

      try {
        const updatedTodo = { ...todo, title: newTitle.trim() };

        await updateTodo(updatedTodo);
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      } catch {
        onError('Unable to update the todo');
      } finally {
        setIsSaving(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={todoItemRef}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          id={`todo-status-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            saveTitle();
          }}
        >
          <input
            data-cy="TodoTitleField"
            className="todo__title-change"
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            autoFocus
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
            data-cy="TodoDelete"
            type="button"
            className="todo__remove"
            onClick={handleDelete}
            disabled={haveId.includes(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': haveId.includes(todo.id) || isSaving,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
