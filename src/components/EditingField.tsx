import React, { FormEvent } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  handleUpdateTodoTitle: (event: FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement, Element>) => void,
  setEditedTitle: (value: React.SetStateAction<string | undefined>) => void,
  editedTitleTodoRef: React.MutableRefObject<HTMLInputElement | null>,
  editedTitle: string | undefined,
  editedTodo: Todo,
  setEditedTodo: (todo: Todo | null) => void;
};

export const EditingField: React.FC<Props> = ({
  handleUpdateTodoTitle,
  setEditedTitle,
  editedTitleTodoRef,
  editedTitle,
  editedTodo,
  setEditedTodo,
}) => {
  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && editedTodo) {
      setEditedTodo(null);
    }
  };

  return (
    <form
      onSubmit={(event) => handleUpdateTodoTitle(event)}
      onBlur={handleUpdateTodoTitle}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        ref={editedTitleTodoRef}
        value={editedTitle}
        onChange={(event) => setEditedTitle(event.target.value)}
        onKeyUp={onKeyPress}
      />
    </form>
  );
};
