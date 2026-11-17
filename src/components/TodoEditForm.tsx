import React, { useEffect, useRef, useState } from 'react';

type Props = {
  initialTitle: string;
  isProcessed: boolean;
  onSave: (title: string) => Promise<boolean>;
  onCancel: () => void;
};

export const TodoEditForm: React.FC<Props> = ({
  initialTitle,
  isProcessed,
  onSave,
  onCancel,
}) => {
  const [draftTitle, setDraftTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFinishing = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const saveTitle = async () => {
    if (isFinishing.current || isProcessed) {
      return;
    }

    isFinishing.current = true;

    const title = draftTitle.trim();

    if (title === initialTitle) {
      onCancel();

      return;
    }

    const isSaved = await onSave(title);

    if (isSaved) {
      onCancel();

      return;
    }

    isFinishing.current = false;
    inputRef.current?.focus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void saveTitle();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={draftTitle}
        readOnly={isProcessed}
        onChange={event => setDraftTitle(event.currentTarget.value)}
        onBlur={() => {
          void saveTitle();
        }}
        onKeyUp={event => {
          if (event.key === 'Escape' && !isFinishing.current && !isProcessed) {
            isFinishing.current = true;
            onCancel();
          }
        }}
      />
    </form>
  );
};
