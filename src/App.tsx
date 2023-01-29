/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  memo,
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  getTodos,
  creatTodo,
  deletingTodo,
  updatingTodoOnServer,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
// eslint-disable-next-line import/no-cycle
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo, TodoCompleteStatus } from './types/Todo';
import { todoFilteredCompleted, getTodoCompletedId } from './helpers/helpers';

export const App: React.FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilterComplete,
    setTodoFilterComplete] = useState(TodoCompleteStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds]
    = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds]
    = useState<number[]>([]);
  const [isTodosCompleted, setIsTodosCompleted] = useState(false);

  const showErrorMessage = useCallback((error: string) => {
    setErrorMessage(error);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(todo => (
          setTodos(todo)))
        .catch(() => showErrorMessage('Failed request for todos'));
    }
  }, []);

  const userId = user ? user.id : 0;

  const addTodo = async (todoData: Omit<Todo, 'id'>) => {
    try {
      const tempTodo = {
        ...todoData,
        id: 0,
      };

      setTemporaryTodo(tempTodo);

      const newTodo = await creatTodo(todoData);

      setTodos(currentTodoArray => [...currentTodoArray, newTodo]);
      setTemporaryTodo(null);
    } catch {
      showErrorMessage('Unable to add a todo');
      setTemporaryTodo(null);
    }
  };

  const deletedTodo = async (todoId: number) => {
    try {
      setDeletingTodoIds(prevList => [...prevList, todoId]);

      const todoToDelete = await deletingTodo(todoId);

      setTodos(oldTodos => oldTodos.filter(todo => todo.id !== todoId));

      setDeletingTodoIds(prevList => (
        prevList.filter(id => id !== todoId)
      ));

      return todoToDelete;
    } catch {
      setDeletingTodoIds(prevList => (
        prevList.filter(id => id !== todoId)
      ));
      showErrorMessage('Unable to delete a todo');

      return false;
    }
  };

  const filteredTodosByStatus = useMemo(() => (
    todoFilteredCompleted(todoFilterComplete, todos)),
  [todoFilterComplete, todos]);

  const uncompletedTodos = todos.filter(todo => !todo.completed);

  const todoCompletedFiltered = todos.filter(todo => todo.completed);
  const visibleListContent = todos.length !== 0 || temporaryTodo;

  const completedTodos = useCallback(() => {
    const filtredTodos = getTodoCompletedId(todos);

    return filtredTodos.forEach(id => deletedTodo(id));
  }, [todos]);

  const updatingTodo = async (todoForUpdating: Todo) => {
    try {
      setUpdatingTodoIds(todoprev => [...todoprev, todoForUpdating.id]);

      const {
        ...valuesToUpdate
      } = todoForUpdating;

      const updatedTodo = await updatingTodoOnServer(valuesToUpdate);

      setTodos((currentTodo) => currentTodo.map(todo => (
        todo.id === updatedTodo.id
          ? updatedTodo
          : todo
      )));
    } catch {
      showErrorMessage('Unable to update a todo');
    } finally {
      setUpdatingTodoIds([]);
    }
  };

  const toggleAllTodos = () => {
    setIsTodosCompleted(true);
    if (isTodosCompleted === false) {
      todos.forEach(todo => {
        if (!todo.completed) {
          updatingTodo({
            ...todo,
            completed: !todo.completed,
          });
        }
      });

      setIsTodosCompleted(true);
    } else {
      todos.forEach(todo => {
        updatingTodo({
          ...todo,
          completed: !todo.completed,
        });
      });
      setIsTodosCompleted(false);
    }
  };

  const visibleTogglerButton = todoCompletedFiltered.length !== todos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={addTodo}
          showErrorMessage={showErrorMessage}
          userId={userId}
          temporaryTodo={temporaryTodo}
          toggleAllTodos={toggleAllTodos}
          visibleTogglerButton={visibleTogglerButton}
        />

        {visibleListContent && (
          <>
            <TodoList
              todos={filteredTodosByStatus}
              deletedTodo={deletedTodo}
              temporaryTodo={temporaryTodo}
              deletingTodoIds={deletingTodoIds}
              onUpdatingTodo={updatingTodo}
              updatingTodoIds={updatingTodoIds}
            />

            <Footer
              todoFilterComplete={todoFilterComplete}
              setTodoToComplete={setTodoFilterComplete}
              completedTodos={completedTodos}
              uncompletedTodos={uncompletedTodos}
              todoCompletedFiltered={todoCompletedFiltered}
            />
          </>
        )}

        {errorMessage && (
          <ErrorNotification
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>
    </div>
  );
});
