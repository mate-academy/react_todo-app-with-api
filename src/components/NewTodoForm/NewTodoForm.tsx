import {
  FC,
  useState,
  useRef,
  FormEvent,
  useEffect,
} from 'react';

type Props = {
  isInputDisabled: boolean;
  onSubmit: (title: string) => void;
};

export const NewTodoForm: FC<Props> = ({ onSubmit, isInputDisabled }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(title.trim());
    setTitle('');
  };

  return (
    <form className="flex-grow" onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="input input-primary w-full
          max-w-full shadow-md focus:outline-offset-0"
        placeholder="What needs to be done?"
        value={title}
        ref={inputRef}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isInputDisabled}
      />
    </form>
  );
};
