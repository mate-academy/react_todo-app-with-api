import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';
import classNames from 'classnames';

type Props = {
  refInputAdd?: HTMLInputElement | null;
  title: string;
  completed: boolean;
  isLoading?: boolean;
  deletedId?: number[];
  id?: number;
  nodeRef?: React.RefObject<HTMLDivElement>;
  handleDelete?: (id: number, el: HTMLInputElement | null) => Promise<number>;
  updateTodo?: (todoId: number, updatePart: string | boolean) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  refInputAdd,
  title,
  completed,
  isLoading = false,
  deletedId,
  handleDelete,
  id,
  updateTodo,
  nodeRef,
}) => {
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [newTitleTodo, setNewTitleTdo] = useState('');
  const refEditInput = useRef<HTMLInputElement | null>(null);

  const showEditForm = () => {
    setIsDoubleClick(true);
  };

  useEffect(() => {
    setNewTitleTdo(title);
  }, [title]);

  useEffect(() => {
    refEditInput.current?.focus();
  }, [isDoubleClick]);

  const closeEditForm = () => setIsDoubleClick(false);

  const udate = async () => {
    if (title === newTitleTodo || !updateTodo || !id) {
      closeEditForm();

      return;
    }

    if (newTitleTodo === '') {
      handleDelete?.(id, refEditInput.current);

      return;
    }

    try {
      await updateTodo(id, newTitleTodo.trim());
      closeEditForm();
    } catch (error) {
      refEditInput.current?.focus();
    }
  };

  const onSubmitUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    udate();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      (event.target as HTMLInputElement).blur();
      setNewTitleTdo(title);
    }
  };

  return (
    <div
      ref={nodeRef}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <Label className="todo__status-label">
        <Input
          type="checkbox"
          className="todo__status"
          dataCy="TodoStatus"
          checked={completed}
          onChange={e => {
            if (id !== undefined && updateTodo) {
              updateTodo(id, e.target.checked);
            }
          }}
        />
      </Label>

      {!isDoubleClick && (
        <span
          onDoubleClick={showEditForm}
          data-cy="TodoTitle"
          className="todo__title"
        >
          {title}
        </span>
      )}
      {!isDoubleClick && (
        <Button
          type="button"
          className="todo__remove"
          dataCy="TodoDelete"
          onClick={() =>
            handleDelete && id && refInputAdd && handleDelete(id, refInputAdd)
          }
          content="×"
        />
      )}

      {isDoubleClick && (
        <form onSubmit={onSubmitUpdate}>
          <Input
            dataCy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onBlur={() => {
              closeEditForm();
              udate();
            }}
            title={newTitleTodo}
            onChange={e => setNewTitleTdo(e.target.value)}
            onKeyUp={handleKeyUp}
            ref={refEditInput}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoading || (id !== undefined && deletedId?.includes(id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
