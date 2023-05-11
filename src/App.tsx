/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
// eslint-disable-next-line object-curly-newline
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { USER_ID } from './constants/userid';
import { FILTERS } from './constants/filters';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { FetchContext } from './context/FetchContext';
import { FooterContext } from './context/FooterContext';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [toggleStatus, setToggleStatus] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FILTERS>(FILTERS.ALL);

  const [addedTodo, setAddedTodo] = useState<Omit<Todo, 'id'> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setToggleStatus(todos.every(todo => todo.completed));
  }, [todos]);

  const calculateNotCompletedTodo = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const notCompletedTodoCount = useMemo(
    calculateNotCompletedTodo,
    [todos],
  );

  const isCompletedExist = todos.length !== notCompletedTodoCount;

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (activeFilter) {
        case FILTERS.ACTIVE:
          return !todo.completed;

        case FILTERS.COMPLETED:
          return todo.completed;

        case FILTERS.ALL:
        default:
          return true;
      }
    });
  }, [todos, activeFilter]);

  const loadTodos = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const todosFromserver = await getTodos(USER_ID);

      setTodos(todosFromserver);
    } catch (error) {
      setErrorMessage('Unable to download todos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const uploadTodo = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (addedTodo) {
        const newTodo = await addTodo(addedTodo);

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setAddedTodo(null);
        setTempTodo(null);
      }
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    uploadTodo();
  }, [addedTodo]);

  // #region Delete functions
  const deleteTodos = async (id: number): Promise<void> => {
    setIsLoading(true);
    try {
      await deleteTodo(id);

      setTodos(prevTodos => prevTodos.filter(
        (todo) => todo.id !== id,
      ));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCompletedTodos = async (): Promise<void> => {
    setIsLoading(true);
    setIsDeletingCompleted(true);
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      setIsDeletingCompleted(false);
    }
  };
  // #endregion

  const updateTodoComplete = async (
    id: number,
    data: Partial<Todo>,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const updetedTodo = await updateTodo(id, data);

      setTodos(prevTodos => prevTodos.map(todo => (
        todo.id !== updetedTodo.id
          ? todo
          : updetedTodo
      )));
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAllTodosComplete = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await Promise.all(todos.map(todo => {
        const updatedTodo = {
          ...todo,
          completed: !toggleStatus,
        };

        return updateTodoComplete(todo.id, updatedTodo);
      }));

      setTodos(prevTodos => prevTodos.map(todo => ({
        ...todo,
        completed: !toggleStatus,
      })));

      setToggleStatus(!toggleStatus);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: toggleStatus,
              })}
              onClick={updateAllTodosComplete}
            />
          )}

          <NewTodo
            onSetErrorMessage={setErrorMessage}
            onSetAddedTodo={setAddedTodo}
            onSetTempTodo={setTempTodo}
            isLoading={isLoading}
          />
        </header>

        {todos && (
          <section className="todoapp__main">
            <FetchContext.Provider value={{ deleteTodos, updateTodoComplete }}>
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                isDeletingCompleted={isDeletingCompleted}
              />
            </FetchContext.Provider>
          </section>
        )}

        {todos.length > 0 && (
          <FooterContext.Provider value={{
            notCompletedTodoCount,
            setActiveFilter,
            isCompletedExist,
            deleteCompletedTodos,
          }}
          >
            <Footer />
          </FooterContext.Provider>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onSetErrorMessage={setErrorMessage}
      />

    </div>
  );
};
