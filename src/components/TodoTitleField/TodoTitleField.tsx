import {
  FC, memo, useState, KeyboardEvent, FormEvent,
} from 'react';

interface Props {
  cancelEditing: () => void;
  oldTitle: string;
  updateTitle: (title: string) => Promise<void>;
  deleteTodo: () => Promise<void>;
}

export const TodoTitleField: FC<Props> = memo((props) => {
  const {
    cancelEditing, oldTitle, updateTitle, deleteTodo,
  } = props;
  const [title, setTitle] = useState(oldTitle);

  const handleCanceling = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const saveChanges = async () => {
    if (oldTitle !== title) {
      await updateTitle(title);
    }

    if (!title.trim()) {
      deleteTodo();

      return;
    }

    cancelEditing();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await saveChanges();
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todo__title input"
        onBlur={saveChanges}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleCanceling}
      />
    </form>
  );
});
