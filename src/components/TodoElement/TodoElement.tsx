/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Loader } from '../Loader';
import { Todo } from '../../types/Todo';

type Props = {
  deleteTodo: (id: number) => void;
  loadingIds: number[];
  todo: Todo;
  updateTodo: (todo: Todo) => Promise<void>;
  filteredTodos: Todo[];
  setErrorMessage: (message: string) => void;
  deleteError: () => void;
};

export const TodoElement: React.FC<Props> = ({
  deleteTodo,
  loadingIds,
  todo,
  updateTodo,
  filteredTodos,
  setErrorMessage,
  deleteError,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && editingTodoId === todo.id) {
      inputRef.current?.focus();
    }
  }, [open, editingTodoId, todo.id]);

  const handleEditTodo = (id: number, title: string) => {
    setOpen(true);
    setEditingTodoId(id);
    setNewTodoTitle(title);
  };

  const handleSubmit = () => {
    if (editingTodoId !== null) {
      const updatedTodo = filteredTodos.find(
        todoItem => todoItem.id === editingTodoId,
      );

      if (updatedTodo) {
        if (newTodoTitle.trim() === '') {
          deleteTodo(updatedTodo.id);
        } else {
          const newTitle = newTodoTitle.trim();

          setIsLoading(true);

          updateTodo({
            ...updatedTodo,
            title: newTitle,
          })
            .then(() => {
              setOpen(false);
              setNewTodoTitle('');
              setEditingTodoId(null);
            })
            .catch(() => {
              setErrorMessage('Unable to update a todo');
              deleteError();
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      }
    }
  };

  const handleBlur = () => {
    if (open) {
      handleSubmit();
    }
  };

  const handleToggleComplete = (todoToggle: Todo) => {
    updateTodo({
      ...todoToggle,
      completed: !todoToggle.completed,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
      setOpen(false);
      setNewTodoTitle('');
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (todo.title === newTodoTitle) {
        setOpen(false);
        setNewTodoTitle('');
        setEditingTodoId(null);
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleComplete(todo)}
        />
      </label>

      {open && editingTodoId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            ref={inputRef}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleEditTodo(todo.id, todo.title)}
        >
          {todo.title}
        </span>
      )}

      {!open && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
          disabled={loadingIds.includes(todo.id) || isLoading}
        >
          ×
        </button>
      )}
      <Loader todo={todo} loadingIds={loadingIds} />
    </div>
  );
};
