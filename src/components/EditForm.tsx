import {
  ChangeEvent,
  FC,
  KeyboardEvent,
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

  const cancelChange = () => {
    setIsEditing(false);
    setQuery(title);
  };

  const onEditTodoFormChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
  };

  const escKeyUpHandler = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      cancelChange();
    }
  };

  const onFormSubmit = () => {
    if (query !== title) {
      editFormSubmitHandler(query.trim());
    }

    setIsEditing(false);
  };

  const onBlurHandler = () => {
    onFormSubmit();
  };

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }
  }, []);

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
        onBlur={onBlurHandler}
        ref={textInput}
        onKeyUp={escKeyUpHandler}
      />
    </form>
  );
};
