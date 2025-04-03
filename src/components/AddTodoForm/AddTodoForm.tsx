import React from 'react';
import { ErrorMessage } from '../../types/Todo';
import { useAddTodoForm } from './useAddTodoForm';
interface Props {
  setErrorMessage: (msg: ErrorMessage) => void;
  onAddTodo: (todo: string) => Promise<void>;
  isFocusAddForm: boolean;
}

export const AddTodoForm: React.FC<Props> = ({
  onAddTodo,
  setErrorMessage,
  isFocusAddForm,
}) => {
  const {
    setInputQuery,
    handleOnSubmit,
    isDisableInput,
    focusInput,
    inputQuery,
  } = useAddTodoForm(onAddTodo, setErrorMessage, isFocusAddForm);

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        value={inputQuery}
        onChange={event => setInputQuery(event.target.value)}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isDisableInput}
        ref={focusInput}
      />
    </form>
  );
};
