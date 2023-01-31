/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useMemo, useState, useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
// eslint-disable-next-line max-len
import {
  getTodos, createTodo, updateTodoById, deleteTodoById,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { filterTodos } from './helpers/complitedFilter';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [complitedFilter, setComplitedFilter] = useState(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isNewTodoLoading, setIsNewTodoLoading] = useState(false);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage('Unable to download todos');
        });
    }
  }, []);

  const uncompletedTodosLength = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const completedTodosLength = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, complitedFilter);
  }, [complitedFilter, todos]);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      const deleteResponse = await deleteTodoById(todoId);

      setTodos(prevTodos => (
        prevTodos.filter(todo => todo.id !== todoId)
      ));

      return deleteResponse;
    } catch (deleteError) {
      return setErrorMessage('Unable to delete a todo');
    }
  }, []);

  const clearCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  const addTodo = useCallback(
    async (event: React.FormEvent<HTMLFormElement>, title: string) => {
      event.preventDefault();

      try {
        if (!title.trim()) {
          setErrorMessage('Title can\'t be empty');

          return;
        }

        setIsNewTodoLoading(true);

        if (user) {
          setTempTodo({
            id: 0,
            userId: user.id,
            title,
            completed: false,
          });

          const newTodo = await createTodo({
            userId: user.id,
            title,
            completed: false,
          });

          setTodos(prevTodos => [...prevTodos, newTodo]);
          setTempTodo(null);
          setIsNewTodoLoading(false);
        }
      } catch (addTodoError) {
        setErrorMessage('Unable to add a todo');
      }
    }, [todos, user],
  );

  const toggleTodoStatus = useCallback(async (
    todoId: number,
    updatedTodoStatus: boolean,
  ) => {
    try {
      const updateResponse = await updateTodoById(
        { completed: updatedTodoStatus }, todoId,
      );

      setTodos(prevTodos => (
        prevTodos.map(todo => {
          return todo.id === todoId
            ? { ...todo, completed: updatedTodoStatus }
            : todo;
        })
      ));

      return updateResponse;
    } catch (updateError) {
      return setErrorMessage('Unable to update a todo');
    }
  }, [todos]);

  const toggleAllTodos = useCallback(async () => {
    const isAllTodoCompleted = todos.every(todo => todo.completed);

    const updatingTodosIds = todos
      .filter(todo => (
        todo.completed === isAllTodoCompleted
      ))
      .map(todo => todo.id);

    setUpdatingTodos(updatingTodosIds);

    try {
      const updatedResponse = await Promise.all(todos.map(todo => (
        updateTodoById({ completed: !isAllTodoCompleted }, todo.id)
      )));

      setTodos(prevTodos => (prevTodos.map(todo => {
        return isAllTodoCompleted
          ? { ...todo, completed: false }
          : { ...todo, completed: true };
      })));

      return updatedResponse;
    } catch (toggleAllError) {
      return setErrorMessage('Unable to update todos');
    } finally {
      setUpdatingTodos([]);
    }
  }, [todos]);

  const updateTodoTitle = useCallback(async (
    todoId: number,
    newTitle: string,
  ) => {
    try {
      const updatedResponse = await updateTodoById({ title: newTitle }, todoId);

      setTodos(prevTodos => (
        prevTodos.map(todo => {
          return todo.id === todoId
            ? { ...todo, title: newTitle }
            : todo;
        })
      ));

      return updatedResponse;
    } catch (updateError) {
      return setErrorMessage('Unable to update todos');
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          toggleAllTodos={toggleAllTodos}
          newTodoField={newTodoField}
          isNewTodoLoading={isNewTodoLoading}
        />
        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              updatingTodos={updatingTodos}
              updateTodoTitle={updateTodoTitle}
              deleteTodo={deleteTodo}
              newTodoField={newTodoField}
              toggleTodoStatus={toggleTodoStatus}
              isNewTodoLoading={isNewTodoLoading}
            />
            <Footer
              completedTodosLength={completedTodosLength}
              uncompletedTodosLength={uncompletedTodosLength}
              complitedFilter={complitedFilter}
              setComplitedFilter={setComplitedFilter}
              clearComplitedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
