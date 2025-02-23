import classNames from 'classnames';
import React from 'react';
import * as postServise from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  checkCompleted: boolean;
  setLoading: (id: number, type: string) => void;
  updateTodos: (todo: Todo) => void;
  errorNotification: (message: string) => void;
};

export const ToggleButton: React.FC<Props> = ({
  todos,
  checkCompleted,
  setLoading,
  updateTodos,
  errorNotification,
}) => {
  const updatedTodo = (newTodo: Todo) => {
    setLoading(newTodo.id, 'turnOn');
    postServise
      .updateTodos(newTodo)
      .then(updateTodo => {
        const todo = updateTodo as Todo;

        updateTodos(todo);
      })
      .catch(() => {
        errorNotification('Unable to update a todo');
      })
      .finally(() => {
        setLoading(newTodo.id, 'turnOff');
      });
  };

  const promiseToggleComleted = (toggledTodo: Todo) => {
    return new Promise<void>(resolve => {
      updatedTodo(toggledTodo);
      resolve();
    });
  };

  const toggleAllCompleted = async () => {
    let togglePromises;

    if (checkCompleted) {
      togglePromises = todos.map(todo => {
        const toggleTodo = { ...todo, completed: false };

        return promiseToggleComleted(toggleTodo);
      });
    } else {
      const completedTodos = todos.filter(todo => !todo.completed);

      togglePromises = completedTodos.map(todo => {
        const toggleTodo = {
          ...todo,
          completed: todo.completed ? false : true,
        };

        return promiseToggleComleted(toggleTodo);
      });
    }

    await Promise.allSettled(togglePromises);
  };

  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: checkCompleted,
      })}
      data-cy="ToggleAllButton"
      onClick={toggleAllCompleted}
    />
  );
};
