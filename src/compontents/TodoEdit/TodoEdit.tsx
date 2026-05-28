import { FormEvent, useEffect, useState } from 'react';

type TodoEditProps = {
  title: string;
  onChange: (title: string) => void;
  onClose: () => void;
};

export function TodoEdit({ title, onChange, onClose }: TodoEditProps) {
  const [editedTitle, setIsEditedTitle] = useState(title);

  useEffect(() => {
    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onClose]);

  const handleBlur = () => {
    const normalizedEditedTitle = editedTitle.trim();

    if (normalizedEditedTitle === title) {
      onClose();

      return;
    }

    onChange(normalizedEditedTitle);
  };

  const handleSumbit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleBlur();
  };

  return (
    <form onSubmit={handleSumbit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedTitle}
        onChange={event => setIsEditedTitle(event.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    </form>
  );
}
