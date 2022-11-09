import React, { useContext } from 'react';
import { Todo } from '../../../types/Todo';
import { TodoUpdateContext } from '../../TodoContext';

type Props = {
  todo: Todo,
  isModified: boolean,
  changeFormStatus: (status: boolean) => void,
  handleActiveTodoId: (id: number) => void,
};

export const TodoTitle: React.FC<Props> = React.memo(({
  todo, isModified, changeFormStatus, handleActiveTodoId,
}) => {
  const {
    setActiveIds,
    deleteTodos,
  } = useContext(TodoUpdateContext);
  const { id, title } = todo;

  // remove one existing todo
  function removeTodo(todoId: number) {
    setActiveIds([todoId]);
    deleteTodos([todoId]);
  }

  // make input field active on double click
  const activateInputField = () => {
    handleActiveTodoId(id);
    changeFormStatus(true);
  };

  return (
    <>
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={activateInputField}
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
});
