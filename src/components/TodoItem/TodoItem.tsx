import cn from 'classnames';
import React, { useEffect, useRef } from 'react';

import { updateTodo } from '../../api/todos';
import { useTodos } from '../../hooks/useTodos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    todos,
    setTodos,
    setIsLoading,
    handleError,
    onDeleteTodo,
    loadingTodosIDs,
    setLoadingTodosIDs,
  } = useTodos();

  const [changedTodoTitle, setChangedTodoTitle] = React.useState(todo.title);
  const [isEditing, setIsEditing] = React.useState(false);

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isEditing]);

  const handleDeleteTodo = () => {
    onDeleteTodo(todo.id);
  };

  const handleCheckbox = () => {
    setIsLoading(true);
    setLoadingTodosIDs(prev => [...prev, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(() => {
        setTodos(
          todos.map(prevTodo => {
            return prevTodo.id === todo.id
              ? { ...prevTodo, completed: !prevTodo.completed }
              : prevTodo;
          }),
        );
      })
      .catch(() => {
        handleError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodosIDs([]);
      });
  };

  const handleAddNewTitle = () => {
    if (!changedTodoTitle) {
      handleDeleteTodo();
      setIsEditing(true);

      return;
    }

    setIsLoading(true);
    setLoadingTodosIDs(prev => [...prev, todo.id]);

    updateTodo(todo.id, { title: changedTodoTitle })
      .then(() => {
        setTodos(
          todos.map(prevTodo => {
            return prevTodo.id === todo.id
              ? { ...prevTodo, title: changedTodoTitle.trim() }
              : prevTodo;
          }),
        );
      })
      .catch(() => {
        handleError('Unable to update a todo');
        setIsEditing(true);
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodosIDs([]);
      });

    setIsEditing(false);
    setChangedTodoTitle(changedTodoTitle.trim());
  };

  const handleInputButtons = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddNewTitle();
    }

    if (event.key === 'Escape') {
      setChangedTodoTitle(todo.title);
      setIsEditing(false);
    }
  };

  const hadleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangedTodoTitle(event.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          aria-label="check todo"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleCheckbox}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={changedTodoTitle}
          ref={inputField}
          onChange={hadleInputChange}
          onBlur={handleAddNewTitle}
          onKeyUp={handleInputButtons}
        />
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
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodosIDs.includes(todo.id) || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
