/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

import { NewFormTodo } from '../NewFormTodo';
import { Todo } from '../../types/Todo';

type Props = {
  isAllTodosActive: boolean,
  isTodosNotEmpty: boolean,
  title: string,
  handleTitleTodo: (newTitle: string) => void,
  addTodo: (titleTodo: string) => void,
  tempTodo: Todo | null,
  handleToggleStatus: () => void,
};

export const Header: React.FC<Props> = ({
  isAllTodosActive,
  isTodosNotEmpty,
  title,
  handleTitleTodo,
  addTodo,
  tempTodo,
  handleToggleStatus,
}) => (
  <header className="todoapp__header">

    {isTodosNotEmpty && (
      <button
        type="button"
        className={cn('todoapp__toggle-all',
          {
            active: isAllTodosActive,
          })}
        onClick={handleToggleStatus}
      />
    )}

    <NewFormTodo
      title={title}
      handleTitleTodo={handleTitleTodo}
      addTodo={addTodo}
      tempTodo={tempTodo}
    />

  </header>
);
