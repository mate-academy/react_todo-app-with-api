/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { TodoForm } from '../TodoForm';
import { Todo } from '../../types/Todo';

interface Props {
  addTodo: (newTodo: Todo) => void;
  setErrorMessage: (errorMessage: string) => void;
  setTempTodo: (newTodo: Todo | null) => void;
  activeTodosCounter: number;
  handleAllTodosStatusChange: () => void;
}

export const TodoHeader: React.FC<Props> = ({
  addTodo,
  setErrorMessage,
  setTempTodo,
  activeTodosCounter,
  handleAllTodosStatusChange,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: activeTodosCounter === 0,
        })}
        onClick={handleAllTodosStatusChange}
      />

      <TodoForm
        addTodo={addTodo}
        setErrorMessage={setErrorMessage}
        setTempTodo={setTempTodo}
      />
    </header>
  );
};
