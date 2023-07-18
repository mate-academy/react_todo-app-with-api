import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo, TodoUpdateData } from './types/Todo';
import { TodoList } from './components/TodoList';
import {
  getTodos,
  addTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';
import { StatusFilter } from './types/StatusFilter';
import { Header } from './components/header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorMessageItem }
  from './components/ErrorMessageItem/ErrorMessageItem';
import { filteredTodos } from './helpers';
import { TempTodo } from './components/TempTodo/TempTodo';

const USER_ID = 10906;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<
  StatusFilter>(StatusFilter.ALL);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const isToggleActive = todos.every(todo => todo.completed);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [errorMessage]);

  const clearForm = () => {
    setTempTodo(null);
    setIsLoading(false);
  };

  const handleAddTodo = useCallback(async (newTitle: string) => {
    if (!newTitle) {
      setErrorMessage(ErrorMessage.TITLE);

      return;
    }

    try {
      setIsLoading(true);

      const newTodoData = {
        userId: USER_ID,
        title: newTitle,
        completed: false,
      };

      setTempTodo({ ...newTodoData, id: 0 });

      const addedTodo = await addTodos(USER_ID, newTodoData);

      setTodos((prevTodos => [...prevTodos, addedTodo]));
      clearForm();
    } catch {
      clearForm();
      setErrorMessage(ErrorMessage.ADD);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodoIds((prevIds) => [...prevIds, todoId]);
      await removeTodo(todoId);

      setTodos((prevTodos => (
        prevTodos.filter(todo => todo.id !== todoId)
      )));

      setLoadingTodoIds((prevIds) => (
        prevIds.filter(prevId => prevId !== todoId)
      ));
    } catch {
      setErrorMessage(ErrorMessage.REMOVE);
    }
  }, []);

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  const activeTodos = useMemo(() => (
    filteredTodos(todos, StatusFilter.ACTIVE)
  ), [todos]);

  const completedTodos = useMemo(() => (
    filteredTodos(todos, StatusFilter.COMPLETED)
  ), [todos]);

  const visibleTodos = useMemo(() => (
    filteredTodos(todos, selectedFilter)
  ), [todos, selectedFilter]);

  const deleteCompletedTodos = async () => {
    try {
      const promisesToDelete = completedTodos.map(todo => (
        handleDeleteTodo(todo.id)));

      await Promise.all(promisesToDelete);
    } catch {
      setErrorMessage(ErrorMessage.REMOVE);
    }
  };

  const handleUpdateTodo = useCallback(async (
    todoToUpdate: Todo, newTitle?: string,
  ) => {
    const newTrimTitle = newTitle?.trim();

    if (newTrimTitle === todoToUpdate.title) {
      return;
    }

    if (newTrimTitle === '') {
      handleDeleteTodo(todoToUpdate.id);

      return;
    }

    try {
      setLoadingTodoIds((prevIds) => [...prevIds, todoToUpdate.id]);
      const newTitleData = {
        title: newTitle,
      };

      const newCompletedData = {
        completed: !todoToUpdate.completed,
      };

      const updateTodoData: TodoUpdateData = newTitle
        ? newTitleData
        : newCompletedData;

      const updatedTodo: Todo = await (
        updateTodo(todoToUpdate.id, updateTodoData)
      );

      setTodos(prevTodos => (
        prevTodos.map(todo => (
          todo.id === todoToUpdate.id
            ? updatedTodo
            : todo
        ))));

      setLoadingTodoIds((prevIds) => (
        prevIds.filter(prevId => prevId !== todoToUpdate.id)));
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    }
  }, []);

  const handleToggleAll = async () => {
    try {
      const todosToUpdate = isToggleActive
        ? completedTodos
        : activeTodos;

      const promisesToUpdate = todosToUpdate.map(todo => (
        handleUpdateTodo(todo)));

      await Promise.all(promisesToUpdate);
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={isLoading}
          isToggleActive={isToggleActive}
          handleToggleAll={handleToggleAll}
          setErrorMessage={setErrorMessage}
          handleAddTodo={handleAddTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={handleDeleteTodo}
              loadingTodoIds={loadingTodoIds}
              onUpdateTodo={handleUpdateTodo}
            />

            {tempTodo && (
              <TempTodo
                todo={tempTodo}
                loadingTodoId={tempTodo.id}
              />
            )}

            <Footer
              activeTodos={activeTodos}
              selectedFilter={selectedFilter}
              completedTodos={completedTodos}
              deleteCompletedTodos={deleteCompletedTodos}
              setSelectedFilter={setSelectedFilter}
            />
          </>
        )}
      </div>

      <ErrorMessageItem
        errorMessage={errorMessage}
        handleCloseError={handleCloseError}
      />

    </div>
  );
};
