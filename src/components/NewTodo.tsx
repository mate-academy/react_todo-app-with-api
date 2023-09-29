import {
  memo,
  useRef,
  useState,
  useEffect,
} from 'react';

import { ErrorMessage } from '../types';

type Props = {
  onAdd: (title: string) => Promise<void>;
  onError: (message: ErrorMessage) => void;
  refocus?: number;
};

export const NewTodo: React.FC<Props> = memo(({
  onAdd,
  onError,
  refocus = 0,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isProcessing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProcessing, refocus]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = inputValue.trim();

    if (!title) {
      onError(ErrorMessage.EmptyTitle);

      return;
    }

    setIsProcessing(true);

    onAdd(title)
      .then(() => setInputValue(''))
      .catch(() => onError(ErrorMessage.AddTodo))
      .finally(() => setIsProcessing(false));
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        data-cy="NewTodoField"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        disabled={isProcessing}
        value={inputValue}
        onChange={event => setInputValue(event.target.value)}
      />
    </form>
  );
});
