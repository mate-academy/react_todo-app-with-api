import './style.scss';
import cn from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodoStatus, updateTodoTitle } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { TodosContext } from '../GlobalStateProvier';

type Props = {
  todo: Todo,
  isTemp: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
}) => {
  const {
    setEditedTodo,
    editedTodo,
    setTodos,
    todos,
    setError,
    deletionId,
    setDeletionId,
    setUpdatedId,
    updatedId,
  } = useContext(TodosContext);
  const { id, title, completed } = todo;
  const isCurrentEdited = editedTodo?.id === todo.id;
  const [titleInput, setTitleInput] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCurrentEdited && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isCurrentEdited]);

  const handleDelete = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        const index = todos.findIndex(item => item.id === todoId);

        setDeletionId(todos[index].id);

        setTodos((prevTodos: Todo[]) => {
          const copy = [...prevTodos];

          copy.splice(index, 1);

          return copy;
        });
      })
      .catch(() => setError(Errors.DeleteError))
      .finally(() => setDeletionId(null));
  };

  const handleCheck = (todoItem: Todo) => {
    updateTodoStatus(todoItem.id, !todoItem.completed)
      .then(() => {
        setUpdatedId(todoItem.id);
        const todosCopy = [...todos];
        const index = todos.findIndex(item => item.id === todoItem.id);
        const updated = { ...todos[index] };

        updated.completed = !updated.completed;
        todosCopy.splice(index, 1, updated);

        setTodos(() => todosCopy);
      })
      .catch(() => setError(Errors.UpdateError))
      .finally(() => setUpdatedId(null));
  };

  const handleDoubleClick = (todoItem: Todo) => {
    setEditedTodo(todoItem);
    setTitleInput(todoItem.title);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (titleInput.trim() === editedTodo?.title) {
      setEditedTodo(null);

      return;
    }

    if (!titleInput.trim()) {
      handleDelete(editedTodo?.id as number);

      return;
    }

    setUpdatedId(editedTodo?.id as number);
    updateTodoTitle(editedTodo?.id as number, titleInput)
      .then(() => {
        const updated = { ...editedTodo };
        const todosCopy = [...todos];
        const index = todos.findIndex(item => item.id === editedTodo?.id);

        updated.title = titleInput;
        todosCopy.splice(index, 1, updated as Todo);

        setTodos(todosCopy);
      })
      .catch(() => setError(Errors.UpdateError))
      .finally(() => {
        setEditedTodo(null);
        setUpdatedId(null);
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodo(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn({
        todo: true,
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleCheck(todo)}
        />
      </label>

      {isCurrentEdited ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleSubmit}
            ref={titleInputRef}
            onKeyUp={handleKeyUp}
          />
        </form>
      )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleDoubleClick(todo)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn({
          modal: true,
          overlay: true,
          isActive: isTemp || deletionId === id || updatedId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
