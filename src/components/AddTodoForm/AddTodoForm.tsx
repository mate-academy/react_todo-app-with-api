import { FC, useEffect, useRef, useState } from 'react';

interface AddTodoFormProps {
  processingTodoIds: number[];
  addNewTodo: (title: string) => Promise<void>;
  isTodoSubmitting: boolean;
}

export const AddTodoForm: FC<AddTodoFormProps> = ({
  processingTodoIds,
  addNewTodo,
  isTodoSubmitting,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isTodoSubmitting && processingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [isTodoSubmitting, processingTodoIds]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.trimStart());
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addNewTodo(title).then(() => setTitle(''));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitleChange}
        disabled={isTodoSubmitting}
      />
    </form>
  );
};
