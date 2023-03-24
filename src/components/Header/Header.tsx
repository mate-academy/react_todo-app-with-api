import {
  FC,
  useState,
  FormEvent,
  useContext,
} from 'react';
import { LoadingTodoContext } from '../../LoadingTodoContext';

type Props = {
  onSubmit: (title: string) => void;
};

export const Header: FC<Props> = ({
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const { isLoading } = useContext(LoadingTodoContext);

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
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
