/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

import {
  createTodo,
  deleteTodoById,
  getTodos,
  updateTodoById,
} from './api/todos';

import { filterTodos } from './helpers/completedFilter';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [complitedFilter, setComplitedFilter] = useState(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isNewTodoLoading, setIsNewTodoLoading] = useState(false);
  const [updatingTodosIds, setUpdatingTodosIdsIds] = useState<number[]>([]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
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

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setUpdatingTodosIdsIds(prev => [...prev, todoId]);
      const deleteResponse = await deleteTodoById(todoId);

      setTodos(prevTodos => (
        prevTodos.filter(todo => todo.id !== todoId)
      ));

      return deleteResponse;
    } catch (deleteError) {
      return setErrorMessage('Unable to delete a todo');
    } finally {
      setUpdatingTodosIdsIds([]);
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
    async (title: string) => {
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
        }
      } catch (addTodoError) {
        setErrorMessage('Unable to add a todo');
      } finally {
        setIsNewTodoLoading(false);
      }
    }, [todos, user],
  );

  const updateTodo = useCallback(async (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    try {
      setUpdatingTodosIdsIds(prevIds => {
        if (!prevIds.includes(todoId)) {
          return [...prevIds, todoId];
        }

        return prevIds;
      });

      const updatedResponse = await updateTodoById(updateData, todoId);

      setTodos(prevTodos => (
        prevTodos.map(todo => {
          return todo.id === todoId
            ? updatedResponse
            : todo;
        })
      ));

      return updatedResponse;
    } catch (updateError) {
      return setErrorMessage('Unable to update a todo');
    } finally {
      setUpdatingTodosIdsIds([]);
    }
  }, [todos]);

  const toggleAllTodos = useCallback(() => {
    const todosChangingStatus = todos.filter(todo => (
      todo.completed === isAllTodosCompleted
    ));

    todosChangingStatus.forEach(todo => {
      updateTodo(todo.id, { completed: !isAllTodosCompleted });
    });
  }, [todos, isAllTodosCompleted]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          addTodo={addTodo}
          isNewTodoLoading={isNewTodoLoading}
          toggleAllTodos={toggleAllTodos}
          isAllTodosCompleted={isAllTodosCompleted}
          todos={todos}
        />
        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              newTodoField={newTodoField}
              todos={visibleTodos}
              deleteTodo={deleteTodo}
              tempTodo={tempTodo}
              isNewTodoLoading={isNewTodoLoading}
              updatingTodosIds={updatingTodosIds}
              updateTodo={updateTodo}
            />
            <Footer
              uncompletedTodosLength={uncompletedTodosLength}
              completedTodosLength={completedTodosLength}
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
