import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoTitle } from './TodoTitle';
import { TodoDeleteButton } from './TodoDeleteButton';
import { TodoLoader } from './TodoLoader';
import { TodoStatusLabel } from './todoStatusLabel';
import { TodoTitleField } from './TodoTitleField';

interface Props {
  todo: Todo,
  isLoading: number[],
  onDelete: (id: number) => void,
  onToggle: (id: number) => void,
  onRename: (newTitle: string, id: number) => void
}

export const TodoComponent: FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onRename,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

  const [isFormRendered, setIsFormRendered] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <TodoStatusLabel
        id={id}
        onToggle={onToggle}
      />

      {
        isFormRendered
          ? (
            <TodoTitleField
              id={id}
              title={title}
              hideForm={setIsFormRendered}
              onRename={onRename}
            />
          )
          : (
            <>
              <TodoTitle
                title={title}
                showForm={setIsFormRendered}
              />

              <TodoDeleteButton
                id={id}
                onDelete={onDelete}
              />
            </>
          )
      }

      <TodoLoader
        isLoading={isLoading}
        id={id}
      />
    </div>
  );
};
