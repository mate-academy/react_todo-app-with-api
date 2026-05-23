import { RefObject, useState, ChangeEvent, FormEvent } from 'react';
import { ValidationError } from '../../types/Error';

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  onCreate: (title: string) => Promise<void>;
  onError: (message: ValidationError) => void;
}

export const CreateTodoForm = ({ inputRef, onCreate, onError }: Props) => {
  const [title, setTitle] = useState('');

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trimStart().replace(/\s{2,}/g, ' ');

    setTitle(value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trimEnd();

    if (trimmedTitle === '') {
      onError(ValidationError.EMPTY_TITLE);

      return;
    }

    onCreate(trimmedTitle).then(() => setTitle(''));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        autoFocus
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleChangeInput}
      />
    </form>
  );
};
