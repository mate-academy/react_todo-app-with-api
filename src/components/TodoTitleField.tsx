import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  title: string,
  id: number,
  hideForm: React.Dispatch<React.SetStateAction<boolean>>,
  onRename: (newTitle: string, id: number) => void
}

export const TodoTitleField: FC<Props> = ({
  title,
  id,
  hideForm,
  onRename,
}) => {
  const field = useRef<HTMLInputElement>(null);

  const [titleTochange, setTitleTochange] = useState(title);

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, []);

  const handleOnTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleTochange(event.currentTarget.value);
  };

  const handleOnBlur = () => {
    onRename(titleTochange, id);

    hideForm(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onRename(titleTochange, id);
    hideForm(false);
  };

  const handleonKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { code } = event;

    if (code !== 'Escape') {
      return;
    }

    hideForm(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={field}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={titleTochange}
        onChange={handleOnTitleChange}
        onBlur={handleOnBlur}
        onKeyDown={handleonKeyDown}
      />
    </form>
  );
};
