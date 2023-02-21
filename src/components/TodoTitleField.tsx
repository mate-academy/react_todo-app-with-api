import {
  FC, FormEvent, KeyboardEvent, memo, useRef, useState,
} from 'react';

type Props = {
  cancelEditing: () => void
  oldTitle: string
  updateTitle: (title: string) => Promise<void>
  deleteTodoById: () => Promise<void>
};

export const TodoTitleField: FC<Props> = memo((props) => {
  const {
    cancelEditing,
    oldTitle,
    updateTitle,
    deleteTodoById,
  } = props;
  const [title, setTitle] = useState(oldTitle);

  const inputRef = useRef<HTMLInputElement>(null);

  const saveChanges = async () => {
    if (!title.trim()) {
      deleteTodoById();

      return;
    }

    if (oldTitle !== title) {
      await updateTitle(title);
    }

    cancelEditing();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await saveChanges();
  };

  const handleCanceling = async (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      await cancelEditing();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo__title todoapp__new-todo todo__title-field"
        onBlur={handleSubmit}
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={handleCanceling}
        ref={inputRef}
      />
    </form>
  );
});
