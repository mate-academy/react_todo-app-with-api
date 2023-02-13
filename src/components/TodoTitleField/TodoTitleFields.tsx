import React, {
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Keyboard } from '../../types/Keyboard';

interface Props {
  oldTitle: string,
  onCancelEditing: () => void,
  onUpdateTitle: (title: string) => Promise<void>,
  onDeleteTodoById: () => Promise<void>,
}

export const TodoTitleField: FC<Props> = memo(({
  oldTitle,
  onCancelEditing,
  onUpdateTitle,
  onDeleteTodoById,
}) => {
  const [title, setTitle] = useState(oldTitle);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCanceling = (event: React.KeyboardEvent) => {
    if (event.key === Keyboard.Escape) {
      onCancelEditing();
    }
  };

  const handleMouseContext = (event: React.MouseEvent) => {
    if ('contextmenu') {
      event.preventDefault();
      onCancelEditing();
    }
  };

  const saveChanges = async () => {
    if (oldTitle !== title) {
      await onUpdateTitle(title);
    }

    if (!title.trim()) {
      onDeleteTodoById();
    }

    onCancelEditing();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    saveChanges();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo__title-field"
        style={{ width: '100%' }}
        value={title}
        onBlur={saveChanges}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleCanceling}
        onContextMenu={handleMouseContext}
        ref={inputRef}
      />
    </form>
  );
});
