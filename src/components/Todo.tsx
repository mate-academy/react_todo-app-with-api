import { FC, useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoTitle } from './TodoTitle';
import { TodoDeleteButton } from './TodoDeleteButton';
import { TodoLoader } from './TodoLoader';
import { TodoStatusLabel } from './todoStatusLabel';
import { TodoTitleField } from './TodoTitleField';
import { EditContext } from '../contexts/EditContext';
import { DeleteContext } from '../contexts/DeleteContext';
import { GlobalContext } from '../contexts/GlobalContext';

interface Props {
  todo: Todo,
}

export const TodoComponent: FC<Props> = ({
  todo,
}) => {
  const {
    isLoading,
  } = useContext(GlobalContext);

  const {
    onDelete,
  } = useContext(DeleteContext);

  const {
    onToggle,
    onRename,
  } = useContext(EditContext);

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
