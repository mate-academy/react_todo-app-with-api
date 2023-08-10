/* eslint-disable jsx-a11y/control-has-associated-label */
import { ChangeEvent, FC, useState } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../types/HelperTypes';

type Props = {
  countOfActive: number,
  addTodo: (title: string) => void,
  setErrorType: (value: ErrorType) => void;
  updateAll:() => void;
};

export const Header: FC<Props> = ({
  countOfActive,
  addTodo,
  setErrorType,
  updateAll,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [inputDisable, setInputDisable] = useState<boolean>(false);

  const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorType(ErrorType.EMPTY_FIELD);

      return;
    }

    try {
      setInputDisable(true);
      await addTodo(todoTitle);
    } finally {
      setInputDisable(false);
      setTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !countOfActive,
        })}
        onClick={() => updateAll()}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitle}
          disabled={inputDisable}
        />
      </form>
    </header>
  );
};
