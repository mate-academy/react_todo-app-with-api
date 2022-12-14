import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
// import { NewTodoForm } from '../NewTodoForm/NewTodoForm';
import { ProcessedContext } from '../ProcessedContext/ProcessedContext';
import { UpdateTodoForm } from '../UpdateTodoForm/UpdateTodoForm';

interface Props {
  todo: Todo,
  onDelete: (todoId: number) => void,
  onUpdate: (todoId: number, dataToUpdate: Partial<Todo>,) => void,
}

export const ActualTodo: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
}) => {
  const { completed, title, id } = todo;
  const { processedTodoIds } = useContext(ProcessedContext);
  const isLoaderActive = id === 0 || processedTodoIds.includes(id);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: completed === true },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => onUpdate(id, { completed: !completed })}
        />
      </label>
      {isEditing
        ? (
          <UpdateTodoForm
            todoId={id}
            onUpdate={onUpdate}
            onEdit={setIsEditing}
          />
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                onDelete(id);
              }}
            >
              ×
            </button>
          </>
        )}
      {/*
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => {
            onDelete(id);
          }}
        >
          ×
        </button> */}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isLoaderActive },
        )}
      >
        <div className="
          modal-background
          has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
