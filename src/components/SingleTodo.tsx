import {
  ChangeEvent,
  FC, useEffect, useMemo, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types';
import { useAppContext } from '../context/AppContext';
import { removeTodo, updateTodo } from '../api/todos';

type Props = {
  todo: Todo,
};

export const SingleTodo: FC<Props> = ({ todo }) => {
  const {
    todos,
    setTodos,
    tempTodo,
    loadData,
    setErrorMessage,
    setShowError,
    todosBeingLoaded,
    setTodosBeingLoaded,
  } = useAppContext();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [todoInputValue, setTodoInputValue] = useState<string>(todo.title);

  const handleTodoRemove = async () => {
    setTodosBeingLoaded(prev => ([
      ...prev,
      todo.id,
    ]));

    try {
      await removeTodo(todo.id);
      await loadData();
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setShowError(true);
    } finally {
      setTodosBeingLoaded(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleChangeStatus = async () => {
    setTodosBeingLoaded(prev => ([...prev, todo.id]));

    try {
      const updatedTodo
      = await updateTodo(todo.id, { completed: !todo.completed });
      const updatedTodos = todos.map(item => (
        item.id === todo.id
          ? updatedTodo
          : item
      ));

      setTodos(updatedTodos as Todo[]);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      setShowError(true);
    } finally {
      setTodosBeingLoaded(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleEdit = () => {
    setIsEditing(prev => !prev);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoInputValue(event.target.value);
  };

  useEffect(() => {
    if (tempTodo?.id === todo.id) {
      setTodosBeingLoaded(prev => ([
        ...prev,
        todo.id,
      ]));
    }
  }, [
    setTodosBeingLoaded,
    setTodosBeingLoaded.length,
    tempTodo?.id,
    todo.id,
  ]);

  const isLoading = useMemo(() => {
    return todosBeingLoaded.includes(todo.id);
  }, [todo.id, todosBeingLoaded]);

  if (!isEditing) {
    return (
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: todo.completed,
        })}
        onDoubleClick={handleEdit}
      >
        <label
          className="todo__status-label"
        >
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleChangeStatus}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleTodoRemove}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active': isLoading,
          })}
        >
          <div
            className="modal-background has-background-white-ter"
          />
          <div className="loader" />
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        {/* This form is shown instead of the title and remove button */}
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoInputValue}
            onChange={handleInputChange}
          />
        </form>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  }

  return null;
};
