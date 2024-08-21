import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { ActiveInput, setActiveInput } from '../../app/features/focusedSlice';
import { DeleteArguments } from './utilsTodoItem';

interface Props {
  query: string;
  todoId: number;
  setIsFocused: (v: boolean) => void;
  handleDeleteTodo: (e: DeleteArguments) => void;
}

export const DefaultForm: React.FC<Props> = ({
  query,
  todoId,
  setIsFocused,
  handleDeleteTodo,
}) => {
  const dispatch = useAppDispatch();

  const formAction = () => {
    dispatch(setActiveInput(ActiveInput.isForm));
    setIsFocused(true);
  };

  return (
    <>
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={formAction}
      >
        {query}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={event => handleDeleteTodo({ event, id: todoId, dispatch })}
      >
        ×
      </button>
    </>
  );
};
