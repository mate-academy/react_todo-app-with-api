import { FormEventHandler } from 'react';

type Props = {
  handleSubmit: FormEventHandler;
  title: string;
  isSubmiting: boolean;
  inputRef: any;
  setTitle: (e: string) => void;
};

export const NewTodoInput = ({
  handleSubmit, title, isSubmiting, inputRef, setTitle,
} : Props) => (
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
      disabled={isSubmiting}
      ref={inputRef}
    />
  </form>
);
