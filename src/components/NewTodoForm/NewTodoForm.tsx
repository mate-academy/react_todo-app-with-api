import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type Props = {
  onAdd: (title: string) => Promise<void>,
};

export const NewTodoForm: React.FC<Props> = React.memo(({
  onAdd,
}) => {
  const [count, setCount] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (count) {
      inputRef.current?.focus();
    }
  }, [count]);

  const resetForm = useCallback(() => {
    setTodoTitle('');
    setCount(c => c + 1);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsCreating(true);

    try {
      await onAdd(todoTitle);
      resetForm();
    } finally {
      setIsCreating(false);
    }
  };

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value.trimStart());
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        value={todoTitle}
        onChange={handleInput}
        disabled={isCreating}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
});
