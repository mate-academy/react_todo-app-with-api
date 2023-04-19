import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
} from 'react';

type Props = {
  title: string,
  onEditingSkip: () => void;
  onTodoTitleUpdate: (newTitle: string) => Promise<void>;
  onTodoDelete: () => Promise<void>;
};

export const TodoEditForm: React.FC<Props> = ({
  title: prevTitle,
  onEditingSkip,
  onTodoTitleUpdate,
  onTodoDelete,
}) => {
  const [title, setTitle] = useState(prevTitle);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleTodoEditingSkip = (escClickEvent: KeyboardEvent) => {
    if (escClickEvent.key !== 'Escape' || !inputRef.current) {
      return;
    }

    onEditingSkip();
  };

  useEffect(() => {
    const todoTitleInput = inputRef.current;

    if (!todoTitleInput) {
      return () => {};
    }

    todoTitleInput.focus();
    todoTitleInput.addEventListener('keyup', handleTodoEditingSkip);

    return () => (
      todoTitleInput.removeEventListener('keyup', handleTodoEditingSkip)
    );
  }, []);

  const handleTodoUpdate = async () => {
    if (!title) {
      await onTodoDelete();

      return;
    }

    if (title === prevTitle) {
      onEditingSkip();

      return;
    }

    await onTodoTitleUpdate(title);
  };

  const handleFormSubmit = (submitEvent: React.SyntheticEvent) => {
    submitEvent.preventDefault();
    handleTodoUpdate();
  };

  const handleTitleChange = (changeEvent: ChangeEvent<HTMLInputElement>) => (
    setTitle(changeEvent.target.value)
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={title}
        onChange={handleTitleChange}
        onBlur={handleTodoUpdate}
        ref={inputRef}
      />
    </form>
  );
};
