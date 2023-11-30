import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

interface Props {
  setErrorMessage: React.Dispatch<string | null>;
  addTodo: (title: string) => Promise<void>;
  toggleCompletedTodo: () => void;
  isAllCompleted: boolean;
}

export const Header: FC<Props> = ({
  addTodo,
  setErrorMessage,
  toggleCompletedTodo,
  isAllCompleted,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizeTitle = todoTitle.trim();

    if (!normalizeTitle) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setIsLoading(true);

    await addTodo(normalizeTitle);

    setIsLoading(false);
    setTodoTitle('');
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const toggleAllTodos = () => {
    toggleCompletedTodo();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="Toggle All"
        className={cn('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        onClick={toggleAllTodos}
      />

      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleChangeInput}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
