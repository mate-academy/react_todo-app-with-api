import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  handleUpdate: (title: string, id: number, completed: boolean) => void;
  handleDelete: (id: number) => void;
  isSubmiting: boolean;
  loader: number;
  setLoader: (value: number) => void;
  handleErrorMessage: (value: string) => void;
  loaderAll: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  handleUpdate,
  handleDelete,
  isSubmiting,
  loader,
  setLoader,
  handleErrorMessage,
  loaderAll,
}) => {
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [isEdited, setIsEdited] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleTitleSubmit = () => {
    setLoader(todo.id);
    if (todoTitle === todo.title) {
      setIsEdited(false);

      return;
    }

    if (todoTitle.trim() === '') {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(t => t.id !== todo.id));
          setIsEdited(false);
        })
        .catch(e => {
          handleErrorMessage('Unable to delete a todo');

          throw e;
        })
        .finally(() => {
          setLoader(0);
        });
    } else {
      setLoader(todo.id);
      updateTodo({
        id: todo.id,
        completed: todo.completed,
        title: todoTitle.trim(),
      })
        .then(() => {
          setIsEdited(false);
          setTodoTitle(currentTitle => currentTitle.trim());
        })
        .catch(e => {
          handleErrorMessage('Unable to update a todo');
          throw e;
        })
        .finally(() => {
          setLoader(0);
        });
    }
  };

  const handleKeyboardEvent = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      handleTitleSubmit();
    }

    if (event.key === 'Escape') {
      setTodoTitle(todo.title);
      setIsEdited(false);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames(
        'todo',
        todo.completed ? 'completed' : 'item-enter-done',
      )}
    >
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={() => {
            handleUpdate(todo.title, todo.id, todo.completed);
          }}
        />
      </label>
      {isEdited ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={todoTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleSubmit}
          onKeyDown={handleKeyboardEvent}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEdited(false);
            setIsEdited(true);
          }}
        >
          {todoTitle}
        </span>
      )}

      {!isEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            handleDelete(todo.id);
          }}
          disabled={isSubmiting}
        >
          ×
        </button>
      )}

      <div
        key={todo.id}
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          (loader === todo.id || loaderAll) && 'is-active',
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
        {todo.title}
      </div>
    </div>
  );
};
