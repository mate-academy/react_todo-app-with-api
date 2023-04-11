import React, {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react';

type Props = {
  addNewTodo: (text: string) => void;
  disableInput: boolean;
  handleEditAll: () => void;
};

export const Header: React.FC<Props> = ({
  addNewTodo,
  disableInput,
  handleEditAll,
}) => {
  const [text, setText] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    addNewTodo(text);
    setText('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        onClick={handleEditAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={text}
          onChange={handleChange}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
