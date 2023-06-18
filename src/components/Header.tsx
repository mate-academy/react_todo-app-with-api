import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../Types';
import { client } from '../utils/client';

interface Props {
  isThereActiveTodo: boolean,
  inputValue: string,
  apiResponseReceived: boolean,
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  updateTempTodo: (value: string) => void,
  setIsEveryThingTrue: React.Dispatch<React.SetStateAction<boolean>>,
  setToggleFalseTodosId: React.Dispatch<React.SetStateAction<number[]>>,
  setTodoStatusChange: React.Dispatch<React.SetStateAction<boolean>>,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setDeleteErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsThereIssue: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export const Header: React.FC<Props> = ({
  isThereActiveTodo,
  inputValue,
  handleFormSubmit,
  updateTempTodo,
  apiResponseReceived,
  setIsEveryThingTrue,
  setTodoStatusChange,
  setToggleFalseTodosId,
  todos,
  setTodos,
  setDeleteErrorMessage,
  setIsThereIssue,
  setIsLoading,
}) => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const updateAllTodo = async () => {
    setTodoStatusChange(true);

    const everyCompleted = todos.every((item) => item.completed);

    if (everyCompleted) {
      setIsEveryThingTrue(true);
    }

    const updatedTodos = todos.map((element) => {
      if (!everyCompleted && element.completed === false) {
        setToggleFalseTodosId(prevState => [...prevState, element.id]);
      }

      return everyCompleted
        ? { ...element, completed: !element.completed }
        : { ...element, completed: true };
    });

    setTodos(updatedTodos);

    try {
      await Promise.all(
        updatedTodos.map(async (todoItem) => {
          await client.patch(`/todos/${todoItem.id}`, {
            ...todoItem,
            completed: todoItem.completed,
          });
        }),
      );
    } catch (error) {
      setDeleteErrorMessage('Unable to update the todo');
      setIsThereIssue(true);
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
      setIsLoading(false);
    }

    setToggleFalseTodosId([]);
    setIsEveryThingTrue(false);
    setTodoStatusChange(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <header className="todoapp__header">
      <label htmlFor="nameInput">
        <button
          id="nameInput"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isThereActiveTodo,
          })}
          onClick={updateAllTodo}
        >
          {null}
        </button>
      </label>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(event) => {
            updateTempTodo(event.target.value);
          }}
          disabled={apiResponseReceived}
        />
      </form>
    </header>
  );
};
