import classNames from 'classnames';
import React from 'react';
import { Todo } from '../Types';
import { client } from '../utils/client';

interface Props {
  isThereActiveTodo: boolean,
  inputValue: string,
  todo: Todo[],
  setTodo: React.Dispatch<React.SetStateAction<Todo[]>>,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  setTempTodo: React.Dispatch<React.SetStateAction<{
    title: string;
    userId: number;
    completed: boolean;
    id: number;
  }>>,
  tempTodo: Todo,
  USER_ID: number,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

function getRandomNumber(): number {
  return Math.floor(Math.random() * 1001);
}

export const Header: React.FC<Props> = ({
  isThereActiveTodo,
  inputValue,
  todo,
  setTodo,
  setInputValue,
  setTempTodo,
  tempTodo,
  USER_ID,
  setIsLoading,
}) => {
  const updatetempTodo = (value: string) => {
    setInputValue(value);

    setTempTodo({
      ...tempTodo,
      title: inputValue,
      id: getRandomNumber(),
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() !== '') {
      const tempTodoItem: Todo = {
        title: inputValue,
        userId: USER_ID,
        completed: false,
        id: getRandomNumber(),
      };

      try {
        await client.post('/todos', tempTodoItem);
        setTodo((prevTodo) => [...prevTodo, tempTodoItem]);
        setIsLoading(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('error');
      }
    }

    setInputValue('');
  };

  const updateAllTodo = async () => {
    const everyCompleted = todo.every((item) => item.completed);

    const updatedTodos = todo.map((element) => {
      return everyCompleted
        ? ({
          ...element,
          completed: !element.completed,
        }) : (
          {
            ...element,
            completed: true,
          }
        );
    });

    setTodo(updatedTodos);

    try {
      setIsLoading(true);

      updatedTodos.map(async (todoItem) => {
        await client.patch(`/todos/${todoItem.id}`, {
          ...todoItem,
          completed: todoItem.completed,
        });
      });

      setIsLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('There is an issue updating todos.', error);
    }
  };

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
            updatetempTodo(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
