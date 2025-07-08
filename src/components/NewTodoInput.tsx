import { memo, useState, useRef, useEffect } from 'react';
import { ErrorType } from '../types/ErrorType';
import { useTodosContext } from '../context/TodoContextProvider';

export const NewTodoInput: React.FC = memo(function NewTodoInput() {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    handleAddTodo,
    isAddingTodo,
    setErrorMessage,
    lastOperationTimestamp,
  } = useTodosContext();

  useEffect(() => {
    if (!isAddingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingTodo, lastOperationTimestamp]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = inputValue.trim();

    if (trimmedTitle === '') {
      setErrorMessage(ErrorType.EMPTY_TITLE);
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setErrorMessage(null);

      try {
        await handleAddTodo(trimmedTitle);
        setInputValue('');
      } catch (error) {}
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        autoFocus
        disabled={isAddingTodo}
      />
    </form>
  );
});
