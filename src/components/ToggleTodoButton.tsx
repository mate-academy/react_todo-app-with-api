/* eslint-disable jsx-a11y/control-has-associated-label */
import classnames from 'classnames';
import { useContext, useCallback } from 'react';
import { AppContext, AppContextType } from '../Contexts/AppContextProvider';
import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

const ToggleTodoButton = () => {
  const {
    todos,
    setIsFetching,
    setTodos,
    setErrorMessage,
  } = useContext(AppContext) as AppContextType;

  const toggleAll = useCallback(() => {
    const condition: boolean = todos.some((todo) => !todo.completed);

    setIsFetching(true);

    const updatedTodos: Todo[] = todos
      .filter((todo) => todo.completed === !condition)
      .map((todo) => {
        return {
          ...todo,
          completed: condition,
        };
      });

    updatedTodos.map(async (toggledTodo) => {
      setTodos((prev) => {
        const untoggledTodos = prev.filter(
          (todo) => todo.completed === condition,
        );

        return [...untoggledTodos, toggledTodo].sort((a, b) => a.id - b.id);
      });

      try {
        await client.patch<Todo>(`/todos/${toggledTodo.id}`, toggledTodo);
      } catch (error) {
        setTodos((prev) => {
          const restTodos = prev.filter((todo) => todo.id !== toggledTodo.id);

          const failedTodo: Todo = {
            ...toggledTodo,
            completed: !toggledTodo.completed,
          };

          return [...restTodos, failedTodo].sort((a, b) => a.id - b.id);
        });
        setErrorMessage('Unable to update a todo');
      }
    });

    setIsFetching(false);
  }, [setErrorMessage, setIsFetching, setTodos, todos]);

  return (
    <button
      type="button"
      className={classnames('todoapp__toggle-all', {
        active: !todos.some((todo) => !todo.completed),
      })}
      data-cy="ToggleAllButton"
      onClick={toggleAll}
    />
  );
};

export { ToggleTodoButton };
