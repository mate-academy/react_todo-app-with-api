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

import {
  getCompletedTodoIds,
  getFilterTodos,
} from './components/helperFunction';
import { useError } from './controllers/useError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempNewTodo, setTempNewTodo] = useState<Todo | null>(null);
  const [completedFilter, setCompletedFilter] = useState<Filter>(Filter.All);
  const [processingTodoIds, setProcessingTodoId] = useState<number[]>([]);
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

  const onDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setProcessingTodoId(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setProcessingTodoId(prev => prev.filter(id => id !== todoId));
    }
  },
  [showError]);

  const deleteTodoCompleted = useCallback(
    () => {
      const completedTodoIds = getCompletedTodoIds(todos);

      completedTodoIds.forEach(id => onDeleteTodo(id));
    },
    [onDeleteTodo, todos],
  );

  const updateTodo = useCallback(async (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    setProcessingTodoId(prevIds => {
      if (!prevIds.includes(todoId)) {
        return [...prevIds, todoId];
      }

      return prevIds;
    });

    try {
      const updatedTodo = await updateTodoOnServer(todoId, fieldsToUpdate);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setProcessingTodoId(prev => prev.filter(id => id !== todoId));
    }
  }, [showError]);

  const completedTodosAmount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const isAllTodosCompleted = todos.length === completedTodosAmount;

  const handleToggleTodosStatus = useCallback(() => {
    const wantedTodoStatus = !isAllTodosCompleted;

    Promise.all(todos.map(
      async (todo) => {
        if (todo.completed !== wantedTodoStatus) {
          updateTodo(todo.id, { completed: wantedTodoStatus });
        }
      },
    ));
  }, [isAllTodosCompleted, todos, updateTodo]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Can\'t load todos'));
    }
  }, [showError, user]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          isAddingTodo={isAddingTodo}
          showError={showError}
          onAddTodo={onAddTodo}
          shouldRenderActiveToggle={isAllTodosCompleted}
          handleToggleTodosStatus={handleToggleTodosStatus}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos}
              tempNewTodo={tempNewTodo}
              onDeleteTodo={onDeleteTodo}
              processingTodoIds={processingTodoIds}
              updateTodo={updateTodo}
              isAddingTodo={isAddingTodo}
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
