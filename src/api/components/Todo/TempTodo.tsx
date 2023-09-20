import React from 'react';
import classNames from 'classnames';
import { ITodo } from '../../../types/Todo';
import { StatusToggler } from './StatusToggler';
import { TodoCard } from '../common/TodoCard';

type Props = {
  todo: ITodo
  loading: boolean;

};

export const TempTodo: React.FC<Props> = (
  {
    todo: { title, completed },
    loading = false,
  },
) => {
  return (
    <div className={classNames('todo', {
      completed,
    })}
    >
      <StatusToggler
        completed={completed}
      />

      <TodoCard
        todoTitle={title}
        loading={loading}
        isSelected
      />

    </div>

  );
};
