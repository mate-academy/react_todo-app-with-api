import React from 'react';
import { Todo } from '../../types/Todo';
import { useTodoUpdate } from './useTodoUpdate';

interface Props {
  updateTodo: Todo;
  setIsUpdate: (val: boolean) => void;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const UpdateTodoForm: React.FC<Props> = ({
  updateTodo,
  setIsUpdate,
  onUpdateTodo,
  onDelete,
}) => {
  const {
    handleOnSubmit,
    handleOnBlur,
    setInputQuery,
    inputQuery,
    focusInput,
  } = useTodoUpdate(updateTodo, setIsUpdate, onUpdateTodo, onDelete);

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        onBlur={handleOnBlur}
        data-cy="TodoTitleField"
        type="text"
        value={inputQuery}
        onChange={event => setInputQuery(event.target.value)}
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        ref={focusInput}
      />
    </form>
  );
};
