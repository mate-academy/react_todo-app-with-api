import cn from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useState } from 'react';
import { Errors } from '../../types/Errors';
import { editTodoTitle, toggleTodo, deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  isTemp: boolean;
  todosToBeDeleted: number[];
  setTodos: (todos: Todo[] | ((todos: Todo[]) => Todo[])) => void;
  setErrorMessage: (text: string) => void;
  onDeleteTodo: (id: number) => void;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
  isTemp,
  todosToBeDeleted,
  onDeleteTodo,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleTodo = async () => {
    setIsUpdating(true);

    try {
      await toggleTodo({ completed: !isCompleted }, todo.id);
      setTodos(prevTodos =>
        prevTodos.map(prevTodo =>
          prevTodo.id === todo.id
            ? { ...prevTodo, completed: !prevTodo.completed }
            : prevTodo,
        ),
      );
      setIsCompleted(prevState => !prevState);
    } catch (error) {
      setErrorMessage(Errors.CantUpdate);
    } finally {
      setIsUpdating(false);
    }
  };

  const startEditing = (id: number, title: string) => {
    setEditingTodoId(id);
    setNewTitle(title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setNewTitle('');
  };

  const saveEditing = async (id: number) => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      setIsUpdating(true);
      try {
        await deleteTodo(id);
        onDeleteTodo(id);
      } catch (error) {
        setErrorMessage(Errors.CantDelete);

        return;
      } finally {
        setIsUpdating(false);
      }

      return;
    }

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    setIsUpdating(true);

    try {
      await editTodoTitle({ title: trimmedTitle }, id);
      setTodos(prevTodos =>
        prevTodos.map(todoItem =>
          todoItem.id === id ? { ...todoItem, title: trimmedTitle } : todoItem,
        ),
      );
      cancelEditing();
    } catch (error) {
      setErrorMessage(Errors.CantUpdate);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmitEditing = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await saveEditing(id);
    } else if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleBlur = async (id: number) => {
    await saveEditing(id);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      {editingTodoId !== todo.id ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => startEditing(todo.id, todo.title)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={() => handleBlur(todo.id)}
            onKeyDown={e => onSubmitEditing(e, todo.id)}
            autoFocus
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active':
            isTemp || todosToBeDeleted.includes(todo.id) || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
