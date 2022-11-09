import React, { useContext } from 'react';
import { Todo } from '../../../types/Todo';
import { TodoUpdateContext } from '../../TodoContext';

type Props = {
  todo: Todo,
  isModified: boolean,
  changeFormStatus: (status: boolean) => void,
};

export const TodoTitle: React.FC<Props> = ({
  todo, isModified, changeFormStatus,
}) => {
  const { setTodoInputStatus, removeTodo } = useContext(TodoUpdateContext);
  const { id, title } = todo;

  const activeInputField = () => {
    setTodoInputStatus(id, todo);
    changeFormStatus(true);
  };

  return (
    <>
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={activeInputField}
        aria-hidden="true"
      >
        {title}
      </span>
      {!isModified && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => removeTodo(id)}
        >
          ×
        </button>
      )}
    </>
  );
};
