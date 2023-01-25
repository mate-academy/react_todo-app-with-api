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
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodoOnServer,
} from './api/todos';

import { getFilterTodos, isAllCompleted } from './components/helperFunction';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedFilter, setCompletedFilter] = useState<Filter>(Filter.all);
  const [processingTodoIds, setProcessingTodoId] = useState<number[]>([]);
  const [isToggleAll, setIsToggleAll] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleError = (message: string): void => {
    setTimeout(() => setErrorMessage(message), 3000);
  };

  const filterTodos = useMemo(() => {
    return getFilterTodos(todos, completedFilter);
  }, [todos, completedFilter]);

  const createTodoClick = useCallback(
    (title: string) => {
      if (!title) {
        setErrorMessage('Title can\'t be empty');

        return;
      }

      if (user) {
        setTempTodo({
          id: 0,
          title,
          completed: false,
          userId: user.id,
        });

        createTodo(title, user.id)
          .then(newTodo => {
            setTodos(prev => [...prev, {
              id: newTodo.id,
              userId: newTodo.userId,
              title: newTodo.title,
              completed: newTodo.completed,
            }]);
          })
          .catch(() => setErrorMessage('Unable to add a todo'))
          .finally(() => {
            setTempTodo(null);
          });
      }
    },
    [user],
  );

  const deleteTodoClick = useCallback(
    (id: number) => {
      setProcessingTodoId([id]);

      deleteTodo(id)
        .then(() => (
          setTodos(currentTodos => currentTodos
            .filter(todo => todo.id !== id))
        ))
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        })
        .finally(() => setProcessingTodoId([]));
    },
    [],
  );

  const deleteTodoCompleted = useCallback(
    () => {
      const completedTodoId = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setProcessingTodoId(completedTodoId);

      const deletePromises = todos.map(todo => {
        if (todo.completed) {
          return deleteTodo(todo.id)
            .then(() => setTodos(prev => prev
              .filter(prevTodo => !completedTodoId.includes(prevTodo.id))));
        }

        return Promise.resolve();
      });

      Promise.all(deletePromises)
        .finally(() => setProcessingTodoId([]));
    },
    [todos],
  );

  const toggleTodoStatus = useCallback(async (id: number, status: boolean) => {
    setProcessingTodoId([id]);

    try {
      await updateTodoOnServer(id, { completed: status });
      setTodos(prev => prev.map(todo => {
        return todo.id === id
          ? { ...todo, completed: status }
          : todo;
      }));
    } catch (e) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodoId([0]);
    }
  }, []);

  const toggleAll = async () => {
    const completedTodoId = todos
      .filter(todo => todo.completed === isToggleAll)
      .map(todo => todo.id);

    setProcessingTodoId(completedTodoId);

    try {
      await Promise.all(todos.map(todo => (
        updateTodoOnServer(todo.id, { completed: !isToggleAll })
      )));

      setTodos(todos.map(todo => ({ ...todo, completed: !isToggleAll })));
      setIsToggleAll(prev => !prev);
    } catch (e) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodoId([0]);
    }
  };

  const updateTodo = useCallback(async (todoToUpdate: Todo) => {
    try {
      const { id, ...fieldsToUpdate } = todoToUpdate;

      setProcessingTodoId([id]);

      const updatedTodo = await updateTodoOnServer(id, fieldsToUpdate);

      setTodos(currentTodos => currentTodos.map(todo => (
        todo.id === updatedTodo.id ? updatedTodo : todo
      )));
    } catch (e) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodoId([0]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          handleError('Unable to load a todos');
        });
    }
  }, [user]);

  useEffect(() => setIsToggleAll(isAllCompleted(todos)), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          newTodoField={newTodoField}
          createTodo={createTodoClick}
          toggleAll={toggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos}
              tempTodo={tempTodo}
              handleDeleteClick={deleteTodoClick}
              processingTodoIds={processingTodoIds}
              updateTodo={updateTodo}
              toggleTodoStatus={toggleTodoStatus}
            />

            <Footer
              todos={todos}
              completedFilter={completedFilter}
              setCompletedFilter={setCompletedFilter}
              handleClearCompleted={deleteTodoCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          error={errorMessage}
          onChange={setErrorMessage}
        />
      )}
    </div>
  );
};
