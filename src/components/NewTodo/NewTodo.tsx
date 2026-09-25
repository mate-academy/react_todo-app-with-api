import { useEffect, useRef } from 'react';

type Props = {
  title: string;
  onTitleChange: (title: string) => void;
  onAddTodo: (title: string) => void;
  setErrorMessage: (onError: string) => void;
  isCreating: boolean;
  todosCount: number;
};

export const NewTodo = ({
  title,
  onTitleChange,
  onAddTodo,
  setErrorMessage,
  isCreating,
  todosCount,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating, todosCount]);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    onAddTodo(trimmedTitle);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={isCreating}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        data-cy="NewTodoField"
        ref={inputRef}
        value={title}
        onChange={event => onTitleChange(event.target.value)}
      />
    </form>
  );
};
