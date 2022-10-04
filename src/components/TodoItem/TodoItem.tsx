import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  todos?: Todo[],
  isActive?: boolean,
  selectedTodosIds?: number[],
  onDelete: (id: number[]) => void;
  onUpdate: (event: React.ChangeEvent<HTMLInputElement>, id: number[]) => void;
  selectedTodoId?: number,
  setSelectedTodoId?: (id: number) => void,
  onRename: (newTitle: string, id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  isActive,
  selectedTodosIds,
  onDelete,
  onUpdate,
  selectedTodoId,
  setSelectedTodoId,
  onRename,
}) => {
  const { id, title, completed } = todo;
  const [doubleClick, setDoubleClick] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodoId]);

  const hundleRenameTodo = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!newTitle && selectedTodoId) {
      onDelete([selectedTodoId]);

      setDoubleClick(false);

      return;
    }

    if (newTitle === title) {
      setDoubleClick(false);
    }

    if (todos?.find(element => element.title === newTitle)) {
      setDoubleClick(false);
    }

    onRename(newTitle, id);
    setDoubleClick(false);
  };

  const hundleDoubleClick = () => {
    setDoubleClick(true);
    if (setSelectedTodoId) {
      setSelectedTodoId(id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setDoubleClick(false);
      setNewTitle(title);
    }
  };

  const handleBlur = () => {
    if (newTitle !== title) {
      hundleRenameTodo();
    }

    if (setSelectedTodoId) {
      setSelectedTodoId(0);
    }

    setDoubleClick(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          name="completed"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={(event) => onUpdate(event, [id])}
        />
      </label>

      {doubleClick && selectedTodoId === id ? (
        <form onSubmit={(event) => hundleRenameTodo(event)}>
          <input
            ref={newTodoField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={hundleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onDelete([id])}
          >
            &times;
          </button>
        </>
      )}

      <Loader
        isActive={isActive}
        selectedTodosIds={selectedTodosIds}
        id={id}
      />
    </div>
  );
};
