/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { ModalOverlay } from './modalOverlay';

type Props = {
  todoInfo: Todo,
  addComplitedTodo: (todoId:number) => void,
  onTodoDelete: (id: number) => void,
  onTodoChangingStatus:(todoId: number, todoStatus: boolean) => Promise<void>,
  todoLoadingId: number[],
};

export const TodoInfo: React.FC<Props> = ({
  todoInfo,
  addComplitedTodo,
  onTodoDelete,
  onTodoChangingStatus,
  todoLoadingId,
}) => {
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [editedValue, setEditedValue] = useState('');
  const [currentStatus, setCurrentStatus] = useState(todoInfo.completed);

  const {
    id,
    title,
  } = todoInfo;

  const onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(target.value);
  };

  const onInputBlur = () => {
    setIsTodoEditing(false);
  };

  const isTodoLoading = id === 0 || todoLoadingId.includes(id);

  return (
    <div className={`todo ${currentStatus ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={currentStatus}
          onChange={() => {
            setCurrentStatus(!currentStatus);
            onTodoChangingStatus(id, !currentStatus);
            addComplitedTodo(id);
          }}
        />
      </label>
      {isTodoEditing ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedValue}
            onChange={onInputChange}
            onBlur={onInputBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}

          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onTodoDelete(id)}
          >
            ×

          </button>
        </>
      )}
      <ModalOverlay
        isTodoUpdating={isTodoEditing}
        isTodoLoading={isTodoLoading}
      />

    </div>
  );
};
