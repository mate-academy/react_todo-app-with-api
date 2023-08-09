import { FC, useState } from 'react';

interface Props {
  onAddTodo: (value: string) => void;
  handleShowError: (value: string) => void;
}

export const TodoForm: FC<Props> = ({
  onAddTodo,
  handleShowError,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const changeTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      handleShowError('Title can\'t be empty');

      return;
    }

    try {
      setIsLoading(true);
      onAddTodo(todoTitle);
      setTodoTitle('');
    } catch {
      handleShowError('Unable to add todo title');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <input
        value={todoTitle}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={changeTitleHandler}
        disabled={isLoading}
      />
    </form>
  );
};
