import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ActiveInput } from '../../app/features/focusedSlice';
import { editingEvent } from './utilsTodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  query: string;
  editingArgs: {
    todo: Todo;
    query: string;
    title: string;
    completed: boolean;
    todoId: number;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  };
  setQuery: (s: string) => void;
}

export const ActiveForm: React.FC<Props> = ({
  query,
  editingArgs,
  setQuery,
}) => {
  const activeInput = useAppSelector(state => state.forms);
  const dispatch = useAppDispatch();

  const args = { ...editingArgs, dispatch };

  return (
    <form onSubmit={event => editingEvent({ ...args, event })}>
      <input
        data-cy="TodoTitleField"
        id="form"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={query}
        onBlur={event => editingEvent({ ...args, event })}
        onChange={event => setQuery(event.target.value)}
        ref={input => activeInput === ActiveInput.isForm && input?.focus()}
      />
    </form>
  );
};
