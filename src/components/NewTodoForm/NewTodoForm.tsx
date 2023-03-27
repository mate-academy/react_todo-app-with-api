import {
  FC,
  useState,
  FormEvent,
} from 'react';

type Props = {
  isInputDisabled: boolean;
  onSubmit: (title: string) => void;
};

export const NewTodoForm: FC<Props> = ({ onSubmit, isInputDisabled }) => {
  const [title, setTitle] = useState('');

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(title);
    setTitle('');
  };

  return (
    <header className="flex gap-2">
      <form className="flex-grow" onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="input input-primary w-full max-w-full shadow-md"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
