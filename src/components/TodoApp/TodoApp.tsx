import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { client } from '../../utils/fetchClient';
import { URL, USER_ID } from '../../utils/Url';
import { Todo } from '../../types/Todo';
import { TodoList } from '../TodoList/TodoList';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setErrorMessage: (a: string) => void;
  todos: Todo[];
  allTodos: Todo[];

};

export const TodoApp: React.FC<Props> = ({
  todos,
  allTodos,
  setTodos,
  setAllTodos,
  setErrorMessage,
}) => {
  const [value, setValue] = useState<string>('');
  const [isToggle, setIsToggle] = useState<boolean>(false);

  useEffect(() => {
    setTodos(allTodos);
  }, [allTodos]);

  const handleAddTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newValue: string = event.target.value;

    setValue(newValue);
  };

  const addNewTodo = async () => {
    if (!value.trim()) {
      return;
    }

    try {
      const newTodoData = {
        title: value,
        completed: false,
        userId: USER_ID,
        id: +(new Date()),
      };
      const addedTodo = await client.post<Todo>(URL, newTodoData);

      setTodos((prevTodos: Todo[]) => [...prevTodos, addedTodo]);
      setIsToggle(false);
      setValue('');
    } catch (error) {
      setErrorMessage('Unable to add todo');
      // eslint-disable-next-line no-console
      console.error('An error occurred:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addNewTodo();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleToggleAllTodos = async () => {
    try {
      if (!isToggle) {
        const updatedTodos = await Promise.all(allTodos.map(todo => {
          const completed = true;

          return { ...todo, completed };
        }));

        setAllTodos(updatedTodos);
        setIsToggle(true);
        setTodos(updatedTodos);
      } else {
        const updatedTodos = await Promise.all(allTodos.map(todo => {
          const completed = !todo.completed;

          return { ...todo, completed };
        }));

        setAllTodos(updatedTodos);
        setTodos(updatedTodos);
      }
    } catch (error) {
      setErrorMessage('Unable to toggle todos');
      // eslint-disable-next-line no-console
      console.error('An error occurred:', error);
    }
  };

  const activeTodos = todos.filter((todo: Todo) => !todo.completed);

  return (
    <>
      <header className="todoapp__header">
        {/* this buttons is active only if there are some active todos */}

        { /* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: (activeTodos.length === 0),
            },
          )}
          onClick={handleToggleAllTodos}
        />

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={value}
            onChange={handleAddTodo}
            onKeyDown={handleKeyPress}
            required
          />
        </form>
      </header>
      <section className="todoapp__main">
        <TodoList
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
        />
      </section>
    </>
  );
};
