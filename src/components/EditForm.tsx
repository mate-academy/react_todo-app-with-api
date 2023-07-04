import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  editFormSubmitHandler: (arg: string) => void,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
  title: string
}

export const EditForm:FC<Props> = (
  {
    editFormSubmitHandler,
    setIsEditing,
    title,
  },
) => {
  const [query, setQuery] = useState(title);

  const cancelChange = useCallback(() => {
    setIsEditing(false);
    setQuery(title);
  }, [setIsEditing, title]);

  const onEditTodoFormChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
  };

  const escKeyUpHandler = useCallback((
    event: KeyboardEvent,
  ) => {
    if (event.key === 'Escape') {
      cancelChange();
    }
  }, [cancelChange]);

  const textInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }

    window.addEventListener('keyup', escKeyUpHandler);

    return () => {
      window.removeEventListener('keyup', escKeyUpHandler);
    };
  }, [escKeyUpHandler]);

  return (
    <form
      onSubmit={() => editFormSubmitHandler(query.trim())}
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={query}
        onChange={onEditTodoFormChange}
        onBlur={() => setIsEditing(false)}
        ref={textInput}
      />
    </form>
  );
};
