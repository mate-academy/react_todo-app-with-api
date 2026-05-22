import { FormEvent, forwardRef, useState } from 'react';

export interface TodoAddFormData {
  title: string;
}

type Props = {
  onSubmit: (values: TodoAddFormData, callback: () => void) => void;
  onError: () => void;
};

export const TodoAdd = forwardRef<HTMLInputElement, Props>(
  ({ onSubmit, onError }, ref) => {
    const [title, setTitle] = useState('');

    function clear() {
      setTitle('');
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const titleTrimmed = title.trim();

      if (!titleTrimmed) {
        onError();

        return;
      }

      onSubmit({ title: titleTrimmed }, clear);
    }

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    );
  },
);

TodoAdd.displayName = 'TodoAdd';
