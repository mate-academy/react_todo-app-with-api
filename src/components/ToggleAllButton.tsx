import classNames from 'classnames';
import { FC, useContext } from 'react';
import { updateTodo } from '../api/todos';
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

  function setErrorsToFalseExceptTogglingError() {
    setIsEmptyTitleErrorShown(false);
    setHasLoadingError(false);
    setIsRemoveErrorShown(false);
    setIsAddingErrorShown(false);

    setIsTogglingErrorShown(true);
  }

  const handleToggleAll = () => {
    setAreTodosToggling(true);

    visibleTodos.forEach(todo => {
      if (user) {
        updateTodo(user.id, todo.id, {
          completed: !isToggleAllActive,
          title: todo.title,
        }).then(() => {
          setIsTogglingErrorShown(false);
          setAreTodosToggling(false);

          setVisibleTodos(prev => prev.map(x => {
            const prevTodo = x;

            prevTodo.completed = !isToggleAllActive;

            return prevTodo;
          }));
        })
          .catch(() => {
            setErrorsToFalseExceptTogglingError();
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
