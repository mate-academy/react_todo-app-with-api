import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

import { TodoContext } from './TodosContext';
import { updateTodo } from '../api/todos';

interface Props {
  todo: Todo;
  // onRename?: (newTitle: string) => Promise<void>
}

export const TodoItem: React.FC<Props> = ({
  todo,
  // onRename = () => Promise.resolve,
}) => {
  const {
    toggleCompleted,
    deleteTodo,
    processingIds,
    setErrorMessage,
    setProcessingIds,
    setTodos,
    inputRef,
  } = useContext(TodoContext);
  const [isEditing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  function renameTodo(todoToUpdate: Todo, newTitle: string) {
    setErrorMessage('');
    setProcessingIds((current) => [...current, todoToUpdate.id]);

    updateTodo({
      ...todoToUpdate,
      title: newTitle,
    })
      .then((updatedTodo) => {
        setTodos((current) => current
          .map((todoItem) => (todoItem.id === updatedTodo.id
            ? updatedTodo
            : todoItem)));
        setEditing(false);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        inputRef.current?.focus();
      })
      .finally(() => {
        setProcessingIds((current) => current
          .filter((id) => id !== todoToUpdate.id));
      });
  }

  const handleToggleTodo = () => {
    toggleCompleted(todo.id);
  };

  const handleDeleteTodo = () => {
    deleteTodo(todo.id);
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle === todo.title.trim()) {
      setEditing(false);

      return;
    }

    if (trimmedTitle === '') {
      handleDeleteTodo();

      return;
    }

    renameTodo(todo, trimmedTitle);
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={handleSubmit}
            ref={inputRef}
            onKeyUp={(event) => {
              if (event.key === 'Escape') {
                setEditing(false);
                setTitle(todo.title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditing(true);
              setTitle(todo.title.trim());
            }}
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
        className={classNames('modal overlay', {
          'is-active': processingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
