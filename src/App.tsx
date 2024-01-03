/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useRef, useState } from 'react';
import * as postServise from './api/todos';
import { Errors } from './types/Errors';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodosContext } from './components/TodoProvider';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    todos,
    setTodos,
    error,
    setError,
  } = useContext(TodosContext);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const toggleTodo = async (todoId: number) => {
    const completedTodo = todos.map(todo => (
      todo.id === todoId
        ? { ...todo, completed: !todo.completed }
        : { ...todo }
    ));
    const currentTodo = completedTodo.find(complted => complted.id === todoId);

    try {
      await postServise.updateTodo({
        todo: currentTodo,
        todoId,
      });
    } catch {
      setError(Errors.UNABLE_UPDATE);
    }

    setTodos(completedTodo);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          title={title}
          setTitle={setTitle}
          inputRef={inputRef}
          handleChangeInput={handleChangeInput}
        />

        <TodoList
          toggleTodo={toggleTodo}
        />

        {!!todos.length && (
          <TodoFooter />
        )}
        {error && (
          <ErrorNotification />
        )}
      </div>
    </div>
  );
};
