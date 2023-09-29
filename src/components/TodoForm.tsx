import { FormEventHandler, useRef } from 'react';

type TodoFormProps = {
  title: string;
  isSubmited: boolean;
  setTitle: (e: string) => void;
  handleSubmit: FormEventHandler;
};

export const TodoForm: React.FC<TodoFormProps> = ({
  title,
  isSubmited,
  setTitle,
  handleSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        disabled={isSubmited}
        ref={inputRef}
      />
    </form>
  );
};
