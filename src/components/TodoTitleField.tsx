import React from 'react';

export type Props = {
  newTitle: string,
  onInputChange(str: string): void,
  onTitleEditting(query: string): void,
  onCancelEditting(ev: React.KeyboardEvent<HTMLInputElement>): void,
};

export const TodoTitleField: React.FC<Props> = ({
  newTitle,
  onInputChange,
  onTitleEditting,
  onCancelEditting,
}) => {
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onTitleEditting(newTitle);
      }}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        placeholder="Empty todo will be deleted"
        className="todo__title-field"
        value={newTitle}
        onChange={(ev) => onInputChange(ev.target.value)}
        onBlur={() => onTitleEditting(newTitle)}
        onKeyDown={(ev) => onCancelEditting(ev)}
      />
    </form>
  );
};
