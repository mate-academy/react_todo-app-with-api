import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodosContext } from '../../contexts/TodosContext';

interface Props {
  todoId: number;
  title: string;
  setIsUpdaiting: (state: boolean) => void
}

export const ChangeTodoForm: React.FC<Props> = (
  {
    todoId,
    title,
    setIsUpdaiting,
  },
) => {
  const [inputValue, setInputValue] = useState(title);
  const { handleDeleteTodo, handleChangeTodo } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSumbit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    if (!inputValue) {
      handleDeleteTodo(todoId);

      return;
    }

    handleChangeTodo(todoId, { title: inputValue });
    setIsUpdaiting(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Esc') {
      setInputValue(title);
      setIsUpdaiting(false);
    }
  };

  return (
    <form onSubmit={handleSumbit}>
      <input
        ref={inputRef}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={() => handleSumbit()}
        onKeyUp={handleKeyUp}
      />
    </form>
  );
};
