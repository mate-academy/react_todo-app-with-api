import {
  ChangeEvent,
  FC,
  FormEvent,
  useState,
} from 'react';
import { LoadError } from '../types/LoadError';

interface Props {
  addNewTodo: (title: string) => Promise<void>
  setError: React.Dispatch<React.SetStateAction<LoadError>>
}

export const NewTodoForm:FC<Props> = ({ addNewTodo, setError }) => {
  const [newTodoQuery, setNewTodoQuery] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  const handleFormInputChange = (event:ChangeEvent<HTMLInputElement>) => {
    setNewTodoQuery(event.target.value);
  };

  const addNewTodoHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoQuery.trim()) {
      setError({
        status: true,
        message: 'Title can\'t be empty',
      });
      setIsInputDisabled(false);

      return;
    }

    setIsInputDisabled(true);
    try {
      await addNewTodo(newTodoQuery);
      setNewTodoQuery('');
    } catch (error) {
      setError({
        status: true,
        message: (error as Error).message,
      });
    } finally {
      setIsInputDisabled(false);
    }
  };

  return (
    <form
      onSubmit={addNewTodoHandler}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoQuery}
        onChange={handleFormInputChange}
        disabled={isInputDisabled}
      />
    </form>
  );
};
