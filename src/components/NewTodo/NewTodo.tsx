import { useRef } from 'react';

type Props = {
  //
};

export const NewTodo: React.FC<Props> = () => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={() => handleFormSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        ref={newTodoField}
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
      />
    </form>
  );
};
