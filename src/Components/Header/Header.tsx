import React, { useState, useContext } from 'react';

import { Context } from '../../Context';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';
import { addTodo, updateTodo } from '../../api/todos';

export const Header = () => {
  const [query, setQuery] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const {
    USER_ID,
    todos,
    setErrorMessage,
    setTodos,
    setTempTodo,
  } = useContext(Context);

  const handleQueryChange = (value: string) => {
    setErrorMessage('');
    setQuery(value);
  };

  const addingTodo = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);
      setQuery('');

      return;
    }

    setDisableInput(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    });

    const newTodo: Omit<Todo, 'id'> = {
      title: query.trim(),
      userId: USER_ID,
      completed: false,
    };

    addTodo(newTodo)
      .then(returnedTodo => {
        setTodos([...todos, returnedTodo]);
      })
      .catch(() => setErrorMessage(ErrorMessage.UNABLE_TO_ADD))
      .finally(() => {
        setTempTodo(null);
        setDisableInput(false);
        setQuery('');
      });
  };

  const completeAll = async () => {
    const allCompleted = todos.every(item => item.completed);

    const updatedTodos = todos.map(item => ({
      ...item,
      completed: !allCompleted,
    }));

    try {
      await Promise.all(
        todos
          .map(todo => updateTodo({ ...todo, completed: !allCompleted })),
      );

      setTodos(updatedTodos);
    } catch (error) {
      setErrorMessage(ErrorMessage.UNABLE_TO_UPDATE);
    }
  };

  return (
    <header className="todoapp__header">
      <>
        {todos.length !== 0 && (
          /*  eslint-disable-next-line jsx-a11y/control-has-associated-label */
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            onClick={completeAll}
          />
        )}

        <form onSubmit={addingTodo}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            disabled={disableInput}
          />
        </form>
      </>
    </header>
  );
};
