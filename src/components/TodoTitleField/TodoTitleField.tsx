import {
  FC,
  memo,
  useState,
  KeyboardEvent,
  FormEvent,
} from 'react';

type Props = {
  oldTitle: string;
  cancelEditing: () => void;
  updateTitle: (title: string) => Promise<void>;
};

export const TodoTotleField: FC<Props> = memo((props) => {
  const { cancelEditing, oldTitle, updateTitle } = props;
  const [title, setTitle] = useState(oldTitle);

  const handleCancelingEddit = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const saveChanges = async () => {
    await updateTitle(title);
    cancelEditing();
  };

  const handleSubmitEdditing = async (event: FormEvent) => {
    event.preventDefault();
    await saveChanges();
  };

  return (
    <form onSubmit={handleSubmitEdditing}>
      <input
        type="text"
        className="todo__title-field"
        onBlur={saveChanges}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleCancelingEddit}
      />
    </form>
  );
});
