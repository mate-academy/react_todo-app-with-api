import { FC, useEffect, useState } from 'react';

import { Todo } from './types/Todo';
import { deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoForm } from './components/TodoForm/TodoForm';
import { filteredTodos } from './helpers';
import { Footer } from './components/Footer';
import { TodoModal } from './components/TodoModal/TodoModal';

const USER_ID = 10917;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);

  const [filter, setFilter] = useState<string | null>('');
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [formLoader, setFormLoader] = useState<boolean>(false);
  const [todosLoader, setTodosLoader] = useState<boolean>(false);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todoFormProps = {
    todos,
    setTodos,
    setErrorMessage,
    formLoader,
    setFormLoader,
    setTodosLoader,
    setTempTodo,
  };

  const todoListProps = {
    visibleTodos,
    setTodos,
    setErrorMessage,
    todosLoader,
    isLoadingCompleted,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTodos(USER_ID);

        setVisibleTodos(response as Todo[]);
        setTodos(response as Todo[]);
      } catch (error) {
        throw new Error('Data not found');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setVisibleTodos(filteredTodos(todos, filter));
  }, [filter, todos]);

  const clearCompletedTodos = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      const deletedTodos = completedTodos
        .map(todo => deleteTodo(todo.id, setTodos, setErrorMessage));

      setIsLoadingCompleted(true);
      await Promise.all(deletedTodos);
      setVisibleTodos(todos.filter(todo => !todo.completed));
      setIsLoadingCompleted(false);
    } catch (error) {
      setErrorMessage('Unable to delete completed todos');
      throw new Error('Error');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm {...todoFormProps} />
        </header>

        <section className="todoapp__main">

          <div>
            <TodoList {...todoListProps} />

            {(formLoader && tempTodo) && (
              <TodoModal tempTodo={tempTodo} />
            )}
          </div>
        </section>

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>
      {errorMessage && (
        <div
          className="
          notification
          is-danger
          is-light
          has-text-weight-normal"
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          <br />
          {errorMessage}
          <br />
        </div>
      )}
    </div>
  );
};
