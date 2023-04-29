import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { createNewTodo } from '../../api/todos';
import { USER_ID } from '../../constants';
import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  updateTodo: (todoId: number, updatedData: Partial<Todo>) => void;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setProcessingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Header: FC<Props> = ({
  setError,
  setTempTodo,
  setTodos,
  setProcessingTodoIds,
  todos,
  updateTodo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newTodoQuery, setNewTodoQuery] = useState('');
  const allTodosCompleted = todos.every(todo => todo.completed);

  const addTodo = async () => {
    try {
      setIsLoading(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: newTodoQuery,
        completed: false,
      });
      setProcessingTodoIds(prevState => [...prevState, 0]);

      const newTodo = await createNewTodo(USER_ID, newTodoQuery);

      setTodos(prevTodos => ([...prevTodos, newTodo]));
    } catch (err) {
      setError(ErrorType.ADD);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
      setProcessingTodoIds(
        prevState => prevState.filter(item => item !== 0),
      );
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
        todo => updateTodo(todo.id, { completed: !todo.completed }),
      );

      return;
    }

    todos.forEach(todo => {
      if (!todo.completed) {
        updateTodo(todo.id, { completed: !todo.completed });
      }
    });
  };

  return (
    <header className="todoapp__header">
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
