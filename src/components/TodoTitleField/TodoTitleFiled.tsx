import React, { useState } from 'react';
import './TodoTitleField.scss';

type Props = {
  onTitleChange: (value: string) => void;
  currentTitle: string;
};

const TodoTitleField: React.FC<Props> = ({ onTitleChange, currentTitle }) => {
  const [inputTitle, setInputTitle] = useState(currentTitle);

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    onTitleChange(inputTitle);
  };

  const onBlur = () => {
    onTitleChange(inputTitle);
  };

  const onInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(e.target.value);
  };

  return (
    <form className="todoTitleField" onSubmit={formSubmitHandler}>
      <input
        type="text"
        className="todoTitleField__input"
        onBlur={onBlur}
        onChange={onInput}
        value={inputTitle}
      />
    </form>
  );
};

export default TodoTitleField;
