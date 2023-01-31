import {
  FC,
  memo,
  useState,
  KeyboardEvent,
  FormEvent,
  useRef,
  useEffect,
} from 'react';

type Props = {
  oldTitle: string;
  cancelEditing: () => void;
  updateTitle: (title: string) => Promise<void>;
  deleteEmptyTodo: () => Promise<void>;
};

export const TodoTotleField: FC<Props> = memo((props) => {
  const {
    cancelEditing,
    oldTitle,
    updateTitle,
    deleteEmptyTodo,
  } = props;
  const [title, setTitle] = useState(oldTitle);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCancelingEddit = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const saveChanges = async () => {
    if (!title.trim()) {
      deleteEmptyTodo();
    }

    if (oldTitle !== title) {
      await updateTitle(title);
    }

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
        ref={inputRef}
      />
    </form>
  );
});
