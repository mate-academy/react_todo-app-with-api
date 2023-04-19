import classNames from 'classnames';
import React from 'react';
import { Form } from '../Form';

type Props = {
  handleChangeStatusAllTodos: () => void;
  hasActiveTodo: boolean;
  handleAddNewTodo: () => void;
  todoTitle: string;
  setTodoTitle: (title: string) => void;
  activeInput: boolean;
};

export const Header: React.FC<Props> = ({
  handleChangeStatusAllTodos,
  hasActiveTodo,
  handleAddNewTodo,
  todoTitle,
  setTodoTitle,
  activeInput,

}) => (
  <header className="todoapp__header">
    <button
      aria-label="clear"
      type="button"
      onClick={handleChangeStatusAllTodos}
      className={classNames(
        'todoapp__toggle-all',
        {
          active: hasActiveTodo,
        },
      )}
    />

    <Form
      handleAddTodo={handleAddNewTodo}
      todoTitle={todoTitle}
      setTodoTitle={setTodoTitle}
      activeInput={activeInput}
    />
  </header>
);
