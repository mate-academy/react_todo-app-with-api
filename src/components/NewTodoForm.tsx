import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (todoData: Omit<Todo, 'id'>) => void
  placeholder: string
  className: string,
  userId: number
};

export const NewTodoForm: React.FC<Props> = ({
  onSubmit,
  placeholder,
  className,
  userId,
}) => {
  const [title, setTitle] = useState<string>('');
  const [completed] = useState(false);
  const [tempDisable, setTempDisable] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const todoData = {
      title,
      completed,
      userId,
    };

    onSubmit(todoData);
    setTempDisable(true);
    setTitle('');

    setTimeout(() => {
      setTempDisable(false);
    }, 500);
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        disabled={tempDisable}
      />
    </form>
  );
};
