/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import classNames from 'classnames';

type Props = {
  totalTodoListLength: number,
  query: string,
  onSetQuery: (query: string) => void,
  isDisabledForm: boolean,
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) =>
  void | Promise<void>;
  onHandleAllTodosStatus: () => void;
};

export const Header: React.FC<Props> = ({
  totalTodoListLength,
  query,
  onSetQuery,
  isDisabledForm,
  handleSubmit,
  onHandleAllTodosStatus,
}) => {
  const isVisibleToggleButton = !!totalTodoListLength;
  const [isActiveToggleButton, setActiveToggleButton] = useState(false);

  const toggleAllTodosStatus = () => {
    onHandleAllTodosStatus();
    setActiveToggleButton(!isActiveToggleButton);
  };

  return (
    <header className="todoapp__header">
      {isVisibleToggleButton && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: isActiveToggleButton })}
          onClick={toggleAllTodosStatus}
        />
      )}

      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => {
            onSetQuery(event.target.value);
          }}
          disabled={isDisabledForm}
        />
      </form>
    </header>
  );
};
