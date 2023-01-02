/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { upDateTodo } from '../../api/todos';

type Props = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setIsLoaderToggle: React.Dispatch<React.SetStateAction<boolean | null>>,
};
export const ToggleAllButton: React.FC<Props> = ({
  todos,
  setTodos,
  setIsLoaderToggle,
}) => {
  if (!todos.length) {
    return null;
  }

  const todosCompleted = todos
    .filter(todo => todo.completed);

  const isActive = todosCompleted.length === todos.length;

  const getArrPromises = (isCompleted: boolean) => todos.map(todo => {
    if (isCompleted === todo.completed) {
      return todo;
    }

    return upDateTodo(
      todo.id,
      { completed: isCompleted },
    );
  });

  const setStatus = (status: boolean) => {
    setIsLoaderToggle(!status);

    Promise.all(getArrPromises(status))
      .then((response) => {
        setTodos(response);
      })
      .finally(() => {
        setIsLoaderToggle(null);
      });
  };

  const handleClickToggleAllButton = () => {
    if (todos.length - todosCompleted.length) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  };

  return (

    <button
      data-cy="ToggleAllButton"
      type="button"
      className={classNames(
        'todoapp__toggle-all',
        { active: isActive },
      )}
      onClick={handleClickToggleAllButton}
    />
  );
};
