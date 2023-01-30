/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoOnServer,
} from './api/todos';

import { getFilterTodos, isAllCompleted } from './components/helperFunction';
import { useError } from './controllers/useError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempNewTodo, setTempNewTodo] = useState<Todo | null>(null);
  const [completedFilter, setCompletedFilter] = useState<Filter>(Filter.all);
  const [processingTodoIds, setProcessingTodoId] = useState<number[]>([]);
  const [isToggleAll, setIsToggleAll] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const user = useContext(AuthContext);
  const [showError, closeError, errorMessages] = useError();

  const filterTodos = useMemo(() => {
    return getFilterTodos(todos, completedFilter);
  }, [todos, completedFilter]);

  const onAddTodo = useCallback(async (fieldsForCreate: Omit<Todo, 'id'>) => {
    try {
      setIsAddingTodo(true);
      setTempNewTodo({
        ...fieldsForCreate,
        id: 0,
      });

      const newTodo = await addTodo(fieldsForCreate);

      setTodos(prevState => [...prevState, newTodo]);
    } catch {
      showError('Unable to add todo');

      throw Error('Error while adding todo');
    } finally {
      setIsAddingTodo(false);
      setTempNewTodo(null);
    }
  },
  [showError]);

  const deleteTodoClick = useCallback(
    (id: number) => {
      setProcessingTodoId([id]);

      deleteTodo(id)
        .then(() => (
          setTodos(currentTodos => currentTodos
            .filter(todo => todo.id !== id))
        ))
        .catch(() => {
          showError('Unable to delete a todo');
        })
        .finally(() => setProcessingTodoId([]));
    },
    [showError],
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

  const changeFilterStatus = useCallback(
    async (id: number, status: boolean) => {
      setProcessingTodoId([id]);

      try {
        await updateTodoOnServer(id, { completed: status });
        setTodos(prev => prev.map(todo => {
          return todo.id === id
            ? { ...todo, completed: status }
            : todo;
        }));
      } catch (e) {
        showError('Unable to update a todo');
      } finally {
        setProcessingTodoId([0]);
      }
    },
    [showError],
  );

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
      showError('Unable to update a todo');
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
      showError('Unable to update a todo');
    } finally {
      setProcessingTodoId([0]);
    }
  }, [showError]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Can\'t load todos'));
    }
  }, [showError, user]);

  useEffect(() => setIsToggleAll(isAllCompleted(todos)), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          isAddingTodo={isAddingTodo}
          showError={showError}
          onAddTodo={onAddTodo}
          toggleAll={toggleAll}
          isToggleAll={isToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos}
              tempNewTodo={tempNewTodo}
              deleteTodo={deleteTodoClick}
              processingTodoIds={processingTodoIds}
              updateTodo={updateTodo}
              changeFilterStatus={changeFilterStatus}
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

      {errorMessages.length > 0 && (
        <ErrorNotification error={errorMessages} close={closeError} />
      )}
    </div>
  );
};
