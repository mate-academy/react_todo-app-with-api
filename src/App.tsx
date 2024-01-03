/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useRef, useState } from 'react';
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
    error,
  } = useContext(TodosContext);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
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

        <TodoList />

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
