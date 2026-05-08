import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  inputRef: React.RefObject<HTMLInputElement>;
  updatingTodoTitle: string;
  setUpdatingTodoTitle: (value: string) => void;
  handleSubmitEditTodos: (todo: Todo) => void;
};

export const TodoEditForm: React.FC<Props> = ({
  todo,
  updatingTodoTitle,
  inputRef,
  setUpdatingTodoTitle,
  handleSubmitEditTodos,
}) => {
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        handleSubmitEditTodos(todo);
      }}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={updatingTodoTitle}
        onChange={event => setUpdatingTodoTitle(event.target.value)}
        onBlur={() => handleSubmitEditTodos(todo)}
        ref={inputRef}
      />
    </form>
  );
};
