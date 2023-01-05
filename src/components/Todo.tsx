import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoTitle } from './TodoTitle';
import { TodoDeleteButton } from './TodoDeleteButton';
import { TodoLoader } from './TodoLoader';
import { TodoStatusLabel } from './todoStatusLabel';

interface Props {
  todo: Todo,
  isLoading: number[],
  onDelete: (id: number) => void,
  onToggle: (id: number) => void,
}

export const TodoComponent: FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <TodoStatusLabel
        id={id}
        onToggle={onToggle}
      />

      <TodoTitle
        title={title}
      />

      <TodoDeleteButton
        id={id}
        onDelete={onDelete}
      />

      <TodoLoader
        isLoading={isLoading}
        id={id}
      />
    </div>
  );
};
