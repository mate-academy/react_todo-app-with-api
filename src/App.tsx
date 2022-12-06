import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addTodo, deleteTodo, getCompletedTodos, getTodos, updateTodoStatus,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';

import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { NewTodo } from './components/TodoComponents/NewTodo';
import { TodoList } from './components/TodoComponents/TodoList';
import { ErrorTypes } from './types/ErrorTypes';
import { Todo } from './types/Todo';
import './App.scss';

export const App: React.FC = () => {
  const [isErrorMessage, setIsErrorMessage]
    = useState<ErrorTypes>(ErrorTypes.none);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);

  const user = useContext(AuthContext);

  const loadTodos = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
        setVisibleTodos(todosFromServer);
      }
    } catch {
      setIsErrorMessage(ErrorTypes.load);
    }
  }, []);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const addNewTodo = async (title: string) => {
    try {
      if (user) {
        const tempData = {
          id: 0,
          userId: user.id,
          title,
          completed: false,
        };
        const addedTodo = await addTodo(tempData);

        if (!addedTodo) {
          setTempTodo(null);
        }

        setIsAdding(true);
        setTempTodo(tempData as Todo);
        setActiveTodoIds([0]);

        await loadTodos();

        setTempTodo(null);
        setIsAdding(false);
        setActiveTodoIds([]);
      }
    } catch {
      setIsErrorMessage(ErrorTypes.upload);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setActiveTodoIds([id]);
      await deleteTodo(id);
      await loadTodos();
      setActiveTodoIds([]);
    } catch {
      setIsErrorMessage(ErrorTypes.delete);
    }
  };

  const removeCompletedTodos = async () => {
    try {
      if (user) {
        const todosToRemove = await getCompletedTodos(user.id);

        setActiveTodoIds(todosToRemove.map(todo => todo.id));

        await Promise.all(todosToRemove.map(async ({ id }) => {
          await deleteTodo(id);
        }));

        await loadTodos();
        setActiveTodoIds([]);
      }
    } catch {
      setIsErrorMessage(ErrorTypes.delete);
    }
  };

  const toggleTodoStatus = async (id: number, completed: boolean) => {
    try {
      if (user) {
        setActiveTodoIds(prevIds => [...prevIds, id]);
        await updateTodoStatus(id, completed);
        await loadTodos();

        setActiveTodoIds(prevIds => prevIds.filter(todoId => todoId !== id));
      }
    } catch {
      setIsErrorMessage(ErrorTypes.update);
    }
  };

  const toggleAllTodoStatus = async () => {
    try {
      const toggeledTodos = activeTodosCount
        ? todos.filter(todo => !todo.completed)
        : todos;

      await Promise.all(toggeledTodos.map(({ id, completed }) => (
        toggleTodoStatus(id, !completed))));
    } catch {
      setIsErrorMessage(ErrorTypes.update);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="ToggleAllButton"
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            onClick={toggleAllTodoStatus}
          />

          <NewTodo
            addNewTodo={addNewTodo}
            isAdding={isAdding}
            setIsErrorMessage={setIsErrorMessage}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              isAdding={isAdding}
              onRemove={removeTodo}
              activeTodoIds={activeTodoIds}
              onTodoToogle={toggleTodoStatus}
            />

            <Footer
              todos={todos}
              visibleTodos={visibleTodos}
              setVisibleTodos={setVisibleTodos}
              onRemoveCompleted={removeCompletedTodos}
              completedTodos={completedTodos}
            />
          </>
        )}

      </div>

      <ErrorNotification
        isErrorMessage={isErrorMessage}
        setIsErrorMessage={setIsErrorMessage}
      />
    </div>
  );
};
