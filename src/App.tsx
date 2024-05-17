/* eslint-disable padding-line-between-statements */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { getTodos, delTodos, addTodos } from './api/todos';
import Filter from './components/Filter';
import TodoList from './components/TodoList';
import NewTodo from './components/NewTodo';
import { Todo, Error } from './types/Todo';
import { ErrorFile } from './components/ErrorFile';
import { client } from './utils/fetchClient';

const App: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<Error | null>(null);
  const [tempTodo, setTempTodo] = useState<string>('');
  const [pending, setPending] = useState<number | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [tit, setTit] = useState('');
  const [isHeaderFocus, setIsHeaderFocus] = useState(false);

  const hideError = () => {
    setError(false);
  };

  setTimeout(hideError, 3000);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch (err) {
        setError(true);
        setErrorType('load');
      }
    };

    fetchTodos();
  }, []);

  const handleSetTempTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTit(e.target.value);
  };

  const handleAddTodo = async (title: string) => {
    if (title.trim() === '') {
      setError(true);
      setErrorType('empty');

      return;
    }

    setTempTodo(title);
    setPending(-1);
    setIsSubmit(true);

    let isErrorAcc = false;

    try {
      const random = Math.floor(Math.random() * 1000);
      const newTodo: Todo = await addTodos({
        userId: 587,
        title,
        completed: false,
        id: random,
      });

      setErrorType('add');
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (err) {
      setError(true);
      setErrorType('add');
      isErrorAcc = true;
    } finally {
      setPending(null);
      setTempTodo('');
      setIsSubmit(false);

      if (!isErrorAcc) {
        setTit('');
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setPending(id);
    try {
      await delTodos(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(true);
      setErrorType('delete');
    } finally {
      setPending(null);
      setIsHeaderFocus(true);
    }
  };

  const handleSetFilter = (selected: 'all' | 'active' | 'completed') => {
    setFilter(selected);
  };

  const handleClearCompleted = () => {
    const updatedTodos = todos.filter(todo => !todo.completed);

    setTodos(updatedTodos);
  };

  const remainingTodoCount = todos.filter(todo => !todo.completed).length;

  const handleToggleTodo = (id: number) => {
    const toggleTodo: Todo[] = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(toggleTodo);
  };

  const handleUpdateTodo = async (
    id: number,
    title: string,
    completed: boolean,
  ) => {
    try {
      await client.patch(`/todos/${id}`, { title, completed });

      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, title: title } : todo)),
      );
    } catch (err) {
      setError(true);
      setErrorType('update');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          onAddTodo={handleAddTodo}
          isSubmit={isSubmit}
          title={tit}
          handleSetTitle={handleSetTempTitle}
          isHeaderFocus={isHeaderFocus}
        />

        {todos.length > 0 && (
          <TodoList
            todos={todos}
            filter={filter}
            onDeleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
            pending={pending}
            handleToggleTodo={handleToggleTodo}
            handleUpdateTodo={handleUpdateTodo}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {remainingTodoCount}
              {remainingTodoCount === 1 ? ' item' : ' items'} left
            </span>
            {todos.length > 0 && (
              <Filter
                selectedFilter={filter}
                onSelectFilter={handleSetFilter}
              />
            )}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={todos.filter(todo => todo.completed).length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <ErrorFile error={error} errorType={errorType} errorHide={hideError} />
    </div>
  );
};

export default App;
