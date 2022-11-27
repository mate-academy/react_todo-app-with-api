import classNames from 'classnames';
import { FC, useContext } from 'react';
import { /* updateTodo, */ updateTodo2 } from '../api/todos';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';
import { ErrorContext } from './ErrorContext';

type Props = {
  visibleTodos: Todo[],
  setAreTodosToggling: React.Dispatch<React.SetStateAction<boolean>>,
  setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
};

export const ToggleAllButton: FC<Props> = ({
  visibleTodos, setAreTodosToggling, setVisibleTodos,
}) => {
  const isToggleAllActive = visibleTodos.every(x => x.completed);
  const user = useContext(AuthContext);
  const {
    setIsTogglingErrorShown,
    setHasLoadingError,
    setIsRemoveErrorShown,
    setIsEmptyTitleErrorShown,
    setIsAddingErrorShown,
  } = useContext(ErrorContext);

  const handleToggleAll = () => {
    setAreTodosToggling(true);

    visibleTodos.forEach(todo => {
      if (user) {
        updateTodo2(/* user.id, */
          todo.id,
          {
            completed: !isToggleAllActive,
            title: todo.title,
          },
        )
          .then(() => {
            setIsTogglingErrorShown(false);
            setAreTodosToggling(false);

            setVisibleTodos(prev => prev.map(x => {
              const prevTodo = x;

              if (isToggleAllActive) {
                prevTodo.completed = false;
              } else {
                prevTodo.completed = true;
              }

              return prevTodo;
            }));
          })
          .catch(() => {
            setIsTogglingErrorShown(true);
            // set all other errors to false so they don`t overlap each other
            setIsEmptyTitleErrorShown(false);
            setHasLoadingError(false);
            setIsRemoveErrorShown(false);
            setIsAddingErrorShown(false);

            setAreTodosToggling(false);
          });
      }
    });
  };

  return (
    <button
      aria-label="toggle"
      data-cy="ToggleAllButton"
      type="button"
      className={classNames(
        'todoapp__toggle-all',
        { active: isToggleAllActive },
      )}
      onClick={handleToggleAll}
    />
  );
};
