import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { createNewTodo } from '../../api/todos';
import { USER_ID } from '../../constants';
import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  changeTodo: (todoId: number, updatedData: Partial<Todo>) => void;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setProcessing: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Header: FC<Props> = ({
  setError,
  setTempTodo,
  setTodos,
  setProcessing,
  todos,
  changeTodo,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [newTodoQuery, setNewTodoQuery] = useState('');
  const allTodosCompleted = todos.every(todo => todo.completed);

  const addTodo = async () => {
    try {
      setLoading(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: newTodoQuery,
        completed: false,
      });
      setProcessing(prevState => [...prevState, 0]);

      const newTodo = await createNewTodo(USER_ID, newTodoQuery);

      setTodos(prevTodos => ([...prevTodos, newTodo]));
    } catch (err) {
      setError(ErrorType.ADD);
    } finally {
      setLoading(false);
      setTempTodo(null);
    }
  };

  const handleOnNewTodoInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setError(ErrorType.NONE);
    setNewTodoQuery(event.target.value);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodoQuery.trim()) {
      setError(ErrorType.EMPTY);

      return;
    }

    addTodo();
    setNewTodoQuery('');
  };

  const handleOnClickToggleAll = () => {
    if (allTodosCompleted) {
      todos.forEach(
        todo => changeTodo(todo.id, { completed: !todo.completed }),
      );

      return;
    }

    todos.forEach(todo => {
      if (!todo.completed) {
        changeTodo(todo.id, { completed: !todo.completed });
      }
    });
  };

  return (
    <header className="todoapp__header">
      {/* this button is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all',
          {
            active: allTodosCompleted,
          })}
        onClick={handleOnClickToggleAll}
      />

      <form onSubmit={handleOnSubmit}>
        <input
          disabled={isLoading}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoQuery}
          onChange={handleOnNewTodoInputChange}
        />
      </form>
    </header>
  );
};
