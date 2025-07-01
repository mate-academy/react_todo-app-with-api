/* eslint-disable import/no-extraneous-dependencies */
import { Todo, AddTodo } from '../types/Todo';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { NewTodo } from './NewTodo';

interface Props {
  handle: () => void;
  handleAdd: (newTodo: AddTodo) => void;
  setErrorMessage: (msg: string) => void;
  tempTodo: Todo | null;
  setInputValue: (value: string) => void;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
}

export const Header: React.FC<Props> = ({
  handle,
  handleAdd,
  setErrorMessage,
  tempTodo,
  setInputValue,
  inputValue,
  inputRef,
  todos,
}) => {
  const everyCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: everyCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handle}
        />
      )}

      <NewTodo
        handleAdd={handleAdd}
        setErrorMessage={setErrorMessage}
        tempTodo={tempTodo}
        setInputValue={setInputValue}
        inputValue={inputValue}
        inputRef={inputRef}
      />
    </header>
  );
};

Header.propTypes = {
  handle: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  tempTodo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }),
  setInputValue: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  inputRef: PropTypes.any.isRequired,
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
};
