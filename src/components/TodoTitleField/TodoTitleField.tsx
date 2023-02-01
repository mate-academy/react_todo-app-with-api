import React, {
  memo,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from 'react';
import { Keyboard } from '../../types/Keyboard';

interface Props {
  prevTitle: string,
  cancelEditing: () => void,
  updateTitle: (title: string) => Promise<void>
}

export const TodoTitleField: React.FC<Props> = memo((props) => {
  const {
    prevTitle,
    cancelEditing,
    updateTitle,
  } = props;

  const [newTitle, setNewTitle] = useState(prevTitle);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCanceling = (event: KeyboardEvent) => {
    if (event.key === Keyboard.Escape) {
      cancelEditing();
    }
  };

  const saveChanges = async () => {
    if (prevTitle !== newTitle) {
      await updateTitle(newTitle);
    }

    cancelEditing();
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveChanges();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        data-cy="TodoTitleField"
        className="todo__title-field"
        type="text"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={event => setNewTitle(event.target.value)}
        onBlur={saveChanges}
        onKeyDown={handleCanceling}
        ref={inputRef}
      />
    </form>
  );
});
