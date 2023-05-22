import { FC, FormEvent, useState } from 'react';
import { Error } from '../../types/Errors';
import { Todo } from '../../types/Todo';

const USER_ID = 10353;

interface Props {
  onError: (error: string) => void;
  onAddTodo: (newTodo: Todo) => void;
  isLoading: boolean;
  // setIsLoading: (status: boolean) => void;
}

export const AddTodoForm: FC<Props> = ({
  onError,
  onAddTodo,
  isLoading,
  // setIsLoading,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      onError(Error.EMPTYTITLE);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      title: query,
      completed: false,
      userId: USER_ID,
    };

    onAddTodo(tempTodo);
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
