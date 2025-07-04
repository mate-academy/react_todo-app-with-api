import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from '../../UserWarning';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';
import classNames from 'classnames';

type HeaderProps = {
  titleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  todoTitle: string;
  titleState: boolean;
  todoList: Todo[];
  add: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmiting: boolean;
  changeEachTodoStatus: (status: boolean) => void;
  edit: Todo['id'] | null;
};

export const Header: React.FC<HeaderProps> = ({
  titleChange,
  todoTitle,
  titleState,
  todoList,
  add,
  isSubmiting,
  changeEachTodoStatus,
  edit,
}) => {
  const focusItem = useRef<HTMLInputElement>(null);
  const [activeToggle, setActiveToggle] = useState(false);

  useEffect(() => {
    if (focusItem.current) {
      focusItem.current.focus();
    }

    if (todoList.length > 0) {
      setActiveToggle(true);
    } else {
      setActiveToggle(false);
    }
  }, [todoTitle, isSubmiting, edit, todoList]);

  const checkArrow =
    todoList.length > 0 && todoList.every(todoItem => todoItem.completed);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const handleToggleAll = () => {
    let statusForChange: Todo['completed'];

    const sameTodoStatus =
      todoList.every(todoItem => todoItem.completed) ||
      todoList.every(todoItem => !todoItem.completed);

    if (sameTodoStatus) {
      statusForChange = todoList[0].completed;
    } else {
      statusForChange = false;
    }

    changeEachTodoStatus(statusForChange);
  };

  return (
    <header className="todoapp__header">
      {activeToggle && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: checkArrow,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={add}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={titleChange}
          disabled={titleState}
          ref={focusItem}
        />
      </form>
    </header>
  );
};
