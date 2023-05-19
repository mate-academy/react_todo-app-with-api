import { useTranslation } from 'react-i18next';
import React from 'react';

interface Props {
  editedTitle: string;
  onInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: (event?: React.FormEvent) => void;
  onCancel: (event: React.KeyboardEvent) => void;
}

export const TodoEditForm: React.FC<Props> = React.memo(({
  editedTitle,
  onInput,
  onUpdate,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={onUpdate}
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder={t('EditForm.empty') as string}
        value={editedTitle}
        onChange={onInput}
        onBlur={onUpdate}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onKeyUp={onCancel}
      />
    </form>
  );
});
