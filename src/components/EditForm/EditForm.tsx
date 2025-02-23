/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { DispatchContext, StateContext } from '../../Store';
import { onDelete, onUpadateTodo } from '../../utils/requests';
import classNames from 'classnames';

type Props = {
  editTodo: Todo | null;
  setEdit: (edit: boolean) => void;
};

export const EditForm: React.FC<Props> = ({ editTodo, setEdit }) => {
  const [newValue, setNewValue] = useState(editTodo?.title || '');
  const [load, setLoad] = useState(false);

  const { errorMessage } = useContext(StateContext);

  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editField.current?.focus();
  }, [errorMessage]);

  const prevValue = editTodo?.title || '';

  const dispatch = useContext(DispatchContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (prevValue === newValue) {
      setEdit(false);

      return;
    }

    if (editTodo) {
      setLoad(true);

      onUpadateTodo(dispatch, editTodo.id, newValue?.trim())
        .then(() => {
          setEdit(false);
        })
        .catch(() => {
          setEdit(true);
        })
        .finally(() => setLoad(false));
    }
  };

  const handleOnBlur = (event: React.FormEvent) => {
    if (newValue?.trim().length === 0) {
      setLoad(true);

      if (editTodo) {
        onDelete(dispatch, editTodo.id).finally(() => setLoad(false));
      }

      return;
    }

    handleSubmit(event);
  };

  const onKeyEnter = (event: React.KeyboardEvent) => {
    event.preventDefault();

    if (newValue?.trim().length === 0) {
      setLoad(true);

      if (editTodo) {
        onDelete(dispatch, editTodo.id).finally(() => setLoad(false));
      }

      return;
    }

    handleSubmit(event);
  };

  const onKeyEscape = () => {
    setEdit(false);
  };

  const onKeyDownHandle = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        onKeyEnter(event);
        break;
      case 'Escape':
        onKeyEscape();
        break;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          data-cy="TodoTitleField"
          ref={editField}
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newValue}
          onChange={event => setNewValue(event.target.value)}
          onKeyDown={onKeyDownHandle}
          onBlur={handleOnBlur}
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': load,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
