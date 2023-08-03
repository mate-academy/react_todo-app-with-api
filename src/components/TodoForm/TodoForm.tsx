/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  todoTitle: string,
  onTodoCreate: (newTodoTitle: string) => void,
  createTodo: () => Promise<any>,
}

export const TodoForm: React.FC<Props> = ({
  todoTitle,
  onTodoCreate,
  createTodo,
}) => {
  const [isProcesing, setIsProcesing] = useState(false);

  const titleFieldReset = () => {
    onTodoCreate('');
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcesing(true);
    createTodo().finally(() => setIsProcesing(false));

    titleFieldReset();
  };

  return (
    <form
      action="./todos"
      method="POST"
      onSubmit={onSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isProcesing}
        value={todoTitle}
        onChange={(event) => onTodoCreate(event.target.value)}
      />
    </form>
  );
};
