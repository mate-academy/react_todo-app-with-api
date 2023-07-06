import {
  ChangeEvent,
  FC,
  KeyboardEvent,
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
  const textInput = useRef<HTMLInputElement | null>(null);

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
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      cancelChange();
    }
  }, [cancelChange]);

  const onFormSubmit = () => {
    if (query !== title) {
      editFormSubmitHandler(query.trim());
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }
  }, [escKeyUpHandler]);

  return (
    <form
      onSubmit={onFormSubmit}
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={query}
        onChange={onEditTodoFormChange}
        onBlur={() => setIsEditing(false)}
        ref={textInput}
        onKeyUp={escKeyUpHandler}
      />
    </form>
  );
};
