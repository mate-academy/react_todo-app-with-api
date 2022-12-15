/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { FooterTodo } from './components/FooterTodo';
import { HeaderTodo } from './components/HeaderTodo';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { StatusToFilter } from './types/StatusToFilter';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(StatusToFilter.All);
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoIdsToDelete, setTodoIdsToDelete] = useState<number[]>([0]);
  const [todoIdsToUpdate, setTodoIdsToUpdate] = useState<number[]>([0]);

  const getUserTodos = useCallback(async () => {
    if (user) {
      try {
        setIsError(false);

        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorText('Unable to connect to server');
        setIsError(true);
      }
    }
  }, []);

  const getVisibleGoods = useCallback((allTodos: Todo[]) => {
    return allTodos.filter(todo => {
      switch (filterStatus) {
        case StatusToFilter.Active:
          return !todo.completed;

        case StatusToFilter.Completed:
          return todo.completed;

        case StatusToFilter.All:
        default:
          return todo;
      }
    });
  }, [todos, filterStatus]);

  const addNewTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    try {
      setIsError(false);
      setIsAdding(true);

      const newTodo = {
        ...todoData,
        id: Math.max(...todos.map(todo => todo.id)) + 1,
      };

      await addTodo(newTodo);

      await getUserTodos();

      setIsAdding(false);
    } catch (error) {
      setErrorText('Unable to add Todo');
      setIsError(true);
    }
  }, []);

  const deleteCurrentTodo = useCallback(async (todoId: number) => {
    try {
      setIsError(false);

      setTodoIdsToDelete(prevTodoIds => [...prevTodoIds, todoId]);

      await deleteTodo(todoId);

      await getUserTodos();

      setTodoIdsToDelete([0]);
    } catch (error) {
      setErrorText('Unable to delete Todo');
      setIsError(true);
    }
  }, []);

  const clearAllCompletedTodos = useCallback(async () => {
    setIsError(false);

    const completedTodos = todos.filter(todo => todo.completed);

    setTodoIdsToDelete(prevTodoIds => (
      [...prevTodoIds, ...completedTodos.map(todo => todo.id)]));

    await Promise.all(completedTodos.map(async (todo) => {
      await deleteCurrentTodo(todo.id);
    }));

    await getUserTodos();
  }, [todos]);

  const updatingTodoTitle = useCallback(
    async (todoId: number, newTitle: string) => {
      try {
        setIsError(false);

        setTodoIdsToUpdate(prevTodoIds => [...prevTodoIds, todoId]);

        await updateTodoTitle(todoId, newTitle);

        await getUserTodos();

        setTodoIdsToUpdate([0]);
      } catch (error) {
        setErrorText('Unable to update Todo');
        setIsError(true);
      }
    }, [],
  );

  const updatingTodoStatus = useCallback(
    async (todoId: number, completed: boolean) => {
      try {
        setIsError(false);

        setTodoIdsToUpdate(prevTodoIds => [...prevTodoIds, todoId]);

        await updateTodoStatus(todoId, completed);

        await getUserTodos();

        setTodoIdsToUpdate([0]);
      } catch (error) {
        setErrorText('Unable to update Todo');
        setIsError(true);
      }
    }, [],
  );

  const setAllTodosToComplete = useCallback(async () => {
    setIsError(false);

    const todosToChange = todos.some(todo => !todo.completed)
      ? todos.filter(todo => !todo.completed)
      : [...todos];

    setTodoIdsToUpdate(prevTodoIds => (
      [...prevTodoIds, ...todosToChange.map(todo => todo.id)]));

    await Promise.all(todosToChange.map(async (todo) => {
      await updatingTodoStatus(todo.id, !todo.completed);
    }));

    await getUserTodos();
  }, [todos]);

  useEffect(() => {
    getUserTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodo
          todos={todos}
          onTodoAdd={addNewTodo}
          user={user}
          title={title}
          onSetTitle={setTitle}
          onSetIsError={setIsError}
          onSetErrorText={setErrorText}
          isAdding={isAdding}
          onSetAllTodosToComplete={setAllTodosToComplete}
        />

        <TodoList
          title={title}
          isAdding={isAdding}
          todoIdsToDelete={todoIdsToDelete}
          todoIdsToUpdate={todoIdsToUpdate}
          todos={getVisibleGoods(todos)}
          deleteCurrentTodo={deleteCurrentTodo}
          onStatusUpdate={updatingTodoStatus}
          onTitleUpdate={updatingTodoTitle}
        />

        {todos.length > 0 && (
          <FooterTodo
            onFilterStatusChange={setFilterStatus}
            filterStatus={filterStatus}
            onClearAllCompletedTodos={clearAllCompletedTodos}
            todos={todos}
          />
        )}
      </div>

      <ErrorNotification
        errorText={errorText}
        isError={isError}
        onSetIsError={setIsError}
      />
    </div>
  );
};
