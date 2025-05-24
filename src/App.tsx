/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FormField } from './components/FormField';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { filterTodos } from './helpers/filterTodos';
import { FilterOptions } from './types/FilterOptions';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosFilter, setTodosFilter] = useState(FilterOptions.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [formText, setFormText] = useState('');
  const [showTempTodo, setShowTempTodo] = useState(false);
  const [focusedTodo, setFocusedTodo] = useState<Todo | null>(null);

  const elemFocus = useRef<HTMLInputElement>(null);

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return filterTodos(todosFilter, todos);
  }, [todos, todosFilter]);

  useEffect(() => {
    elemFocus.current?.focus();

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <FormField
          elementFocus={elemFocus}
          formText={formText}
          todos={todos}
          errorMessage={errorMessage}
          setTodos={setTodos}
          setFormText={setFormText}
          setErrorMessage={setErrorMessage}
          setShowTempTodo={setShowTempTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              formText={formText}
              focusedTodo={focusedTodo}
              todos={todos}
              currentTodos={visibleTodos}
              showTempTodo={showTempTodo}
              errorMessage={errorMessage}
              setFocusedTodo={setFocusedTodo}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              inputRef={elemFocus}
            />
            <Footer
              todos={todos}
              activeTodosCount={activeTodosCount}
              todosFilter={todosFilter}
              errorMessage={errorMessage}
              setTodos={setTodos}
              setTodosFilter={setTodosFilter}
              setErrorMessage={setErrorMessage}
              inputRef={elemFocus}
            />
          </>
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
