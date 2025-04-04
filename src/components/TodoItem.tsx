import React, { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { TodoLoader } from './TodoLoader';
import * as todosService from '../api/todos';

interface TodoIt {
  tempTodo: Todo;
  isTempTodo: boolean;
  controlChecked: number[];
  setControlChecked: Dispatch<SetStateAction<number[]>>;
  setTodoItem: Dispatch<SetStateAction<Todo[]>>;
  handleTodoDelete: (usersId: number) => void;
  arrTodos: number[];
  delLoader: number | null;
  loaderApi: boolean;
  updatedPost: (updatedPosts: Todo) => void;
  setStateError: React.Dispatch<React.SetStateAction<string>>;
}

export const TodoItem: React.FC<TodoIt> = ({
  tempTodo,
  isTempTodo,
  setControlChecked,
  setTodoItem,
  handleTodoDelete,
  arrTodos,
  delLoader,
  loaderApi,
  updatedPost,
  setStateError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tempTodo.title);
  const [loader, setLoader] = useState(false);

  const toggleTodo = (id: number) => {
    setControlChecked(prev =>
      prev.includes(id) ? prev.filter(todoId => todoId !== id) : [...prev, id],
    );

    const todoToUpdate = { ...tempTodo, completed: !tempTodo.completed };

    setLoader(true);

    todosService
      .updatePost(todoToUpdate)
      .then(newTodo => {
        setTodoItem(prevItems =>
          prevItems.map(todo => (todo.id === id ? newTodo : todo)),
        );
      })
      .finally(() => {
        setControlChecked(prev => prev.filter(todoId => todoId !== id));
        setLoader(false);
      });
  };

  const isLoading = arrTodos.includes(tempTodo.id) || delLoader === tempTodo.id;

  const handleEditSubmit = () => {
    if (!editValue.trim()) {
      handleTodoDelete(tempTodo.id);

      return;
    }

    const updatedTodo = { ...tempTodo, title: editValue.trim() };

    setLoader(true);

    todosService
      .updatePost(updatedTodo)
      .then(() => {
        setTodoItem(prevItems =>
          prevItems.map(todo => (todo.id === tempTodo.id ? updatedTodo : todo)),
        );
        setIsEditing(false);
      })
      .catch(() => {
        setStateError('Unable to update a todo');
        setTimeout(() => setStateError(''), 3000);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <div>
      <div
        data-cy="Todo"
        key={tempTodo.id}
        className={classNames('todo', {
          completed: tempTodo.completed,
        })}
      >
        <label
          className="todo__status-label"
          aria-label="Toggle status"
          onClick={() => {
            const updatedTodo = { ...tempTodo, completed: !tempTodo.completed };

            toggleTodo(tempTodo.id);
            // toggleAllTodos();
            updatedPost(updatedTodo);
          }}
        >
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={tempTodo.completed}
            readOnly
          />
        </label>

        {isEditing ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleEditSubmit();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditValue(tempTodo.title);
                }

                if (e.key === 'Enter') {
                  e.preventDefault();

                  if (editValue.trim() === tempTodo.title.trim()) {
                    setIsEditing(false);
                  } else {
                    handleEditSubmit();
                  }
                }
              }}
              autoFocus
            />
          </form>
        ) : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {tempTodo.title}
          </span>
        )}

        {!isEditing && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(tempTodo.id)}
          >
            ×
          </button>
        )}

        <TodoLoader
          isActive={
            isLoading ||
            delLoader === tempTodo.id ||
            loader ||
            isTempTodo ||
            loaderApi
          }
        />
      </div>
    </div>
  );
};
