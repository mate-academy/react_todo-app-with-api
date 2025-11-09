import React, { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  defaultValue: Todo['title'];
  onSubmit: (title: Todo['title']) => void;
  onCancel: () => void;
};

export const UpdateTodoTitleForm: React.FC<Props> = ({
  defaultValue,
  onSubmit,
  onCancel,
}) => {
  const [newTitle, setNewTitle] = useState(defaultValue);

  const handleSaveNewTitle = () => {
    onSubmit(newTitle.trim());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleSaveNewTitle();
  };

  const handleBlur = () => {
    handleSaveNewTitle();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        autoFocus
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={event => setNewTitle(event.target.value.trimStart())}
        onBlur={handleBlur}
        onKeyUp={event => {
          if (event.key === 'Escape') {
            onCancel();
          }
        }}
      />
    </form>
  );
};
