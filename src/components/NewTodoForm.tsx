import {
  ChangeEvent,
  FC,
  FormEvent,
  useState,
} from 'react';

interface Props {
  addNewTodo: (title: string) => Promise<void>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

export const NewTodoForm:FC<Props> = ({ addNewTodo, setError }) => {
  const [newTodoQuery, setNewTodoQuery] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  const handleFormInputChange = (event:ChangeEvent<HTMLInputElement>) => {
    setNewTodoQuery(event.target.value);
  };

  const addNewTodoHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isNewTitleEmpty = !newTodoQuery.trim();

    if (isNewTitleEmpty) {
      setError('Title can\'t be empty');
      setIsInputDisabled(false);

      return;
    }

    setIsInputDisabled(true);
    try {
      await addNewTodo(newTodoQuery);
      setNewTodoQuery('');
    } catch (error) {
      setError((error as Error).message);
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
