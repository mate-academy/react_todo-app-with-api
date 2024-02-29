import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { TodoLoader } from '../TodoLoader/TodoLoader';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (id: number) => void;
  loading?: boolean;
  updateCurrentTodo?: (todo: Todo) => void;
  listOfLoadingTodos?: Todo[] | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  loading,
  updateCurrentTodo,
  listOfLoadingTodos,
}) => {
  const { id, title, completed } = todo;

  const [itemLoading, setItemLoading] = useState(false);

  const [editable, setEditable] = useState(false);

  const [editedTitle, setEditedTitle] = useState(title);

  const editField = useRef<HTMLInputElement>(null);

  const handleDoubleClick = useCallback(() => {
    setEditable(true);
  }, []);

  useEffect(() => {
    if (editField.current) {
      editField.current.focus();
    }
  }, [editable]);

  useEffect(() => {
    if (!todo) {
      setItemLoading(true);
    }
  }, [todo]);

  useEffect(() => {
    if (loading) {
      setItemLoading(true);
    }
  }, [loading]);

  useEffect(() => {
    if (listOfLoadingTodos && listOfLoadingTodos.includes(todo)) {
      setItemLoading(true);
    }

    if (listOfLoadingTodos && !listOfLoadingTodos.includes(todo)) {
      setItemLoading(false);
    }
  }, [listOfLoadingTodos, todo]);

  const handleTodoDelete = () => {
    setItemLoading(true);
    onDelete(id);
    setTimeout(() => {
      setItemLoading(false);
    }, 1000);
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && updateCurrentTodo) {
      if (title === editedTitle) {
        setEditable(false);

        return;
      }

      if (!editedTitle.trim()) {
        handleTodoDelete();

        return;
      }

      setItemLoading(true);

      updateCurrentTodo({
        ...todo,
        title: editedTitle.trim(),
      });

      setTimeout(() => {
        setItemLoading(false);
        setEditable(false);
      }, 500);

      setEditedTitle(currentEditedTitle => currentEditedTitle.trim());
    }
  };

  const handleEscapeKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditable(false);
    }
  };

  const updateTodoOnBlur = () => {
    if (updateCurrentTodo) {
      if (title === editedTitle) {
        setEditable(false);

        return;
      }

      if (!editedTitle.trim()) {
        handleTodoDelete();

        return;
      }

      setItemLoading(true);

      updateCurrentTodo({
        ...todo,
        title: editedTitle.trim(),
      });

      setTimeout(() => {
        setItemLoading(false);
        setEditable(false);
      }, 500);

      setEditedTitle(currentEditedTitle => currentEditedTitle.trim());
    }
  };

  const handleItemToggle = () => {
    if (updateCurrentTodo) {
      setItemLoading(true);

      updateCurrentTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTimeout(() => {
        setItemLoading(false);
      }, 500);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
        editing: editable,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          value={title}
          onChange={handleItemToggle}
        />
      </label>
      {!editable && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleTodoDelete}
          >
            ×
          </button>
        </>
      )}

      {editable && (
        <input
          data-cy="TodoTitleField"
          ref={editField}
          type="text"
          className="edit"
          value={editedTitle}
          onKeyDown={handleEnterKey}
          onKeyUp={handleEscapeKey}
          onChange={event => setEditedTitle(event.target.value)}
          onBlur={updateTodoOnBlur}
        />
      )}
      <TodoLoader itemLoading={itemLoading} />
    </div>
  );
};
