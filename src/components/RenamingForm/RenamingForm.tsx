/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Dispatch, RefObject, SetStateAction } from 'react';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  handleButtonChange: (e: React.KeyboardEvent) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlerBlur: () => void;
  isLoading: boolean;
  todo: Todo;
  value: string;
  inputElem: RefObject<HTMLInputElement>;
  setValue: Dispatch<SetStateAction<string>>;
};
export const RenamingForm: React.FC<Props> = ({
  handleButtonChange,
  handleSubmit,
  handlerBlur,
  isLoading,
  todo,
  value,
  inputElem,
  setValue,
}) => {
  const { completed } = todo;
  const handleEditingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          checked={completed}
          className="todo__status"
        />
      </label>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputElem}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={value}
          onKeyUp={handleButtonChange}
          onBlur={handlerBlur}
          onChange={handleEditingInput}
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
