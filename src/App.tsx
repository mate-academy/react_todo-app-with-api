import React, {
  useState, useContext, useEffect, useMemo, useCallback,
} from 'react';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

import {
  getFilteredTodo,
  getNotCompletedTodoNumber,
  getCompletedTodoNumber,
} from './utils/FilteredTodo';

import { debounce } from './utils/debounce';

import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [debounceTodoTitle, setDebounceTodoTitle] = useState('');
  const [filteredType, setFilteredType] = useState(FilterType.All);
  const [errorAlert, setErrorAlert] = useState<ErrorType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(0);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);

  const visibleTodo = useMemo(() => (
    getFilteredTodo(todos, filteredType)
  ), [todos, filteredType]);

  const notCompletedTodos = useMemo(() => (
    getNotCompletedTodoNumber(todos)
  ), [todos, filteredType]);

  const completedTodos = useMemo(() => (
    getCompletedTodoNumber(todos)
  ), [todos, filteredType]);

  const applyTodoTitle = useCallback(
    debounce(setDebounceTodoTitle, 100),
    [],
  );

  const loadTodosFromServer = useCallback(
    async () => {
      try {
        if (user?.id) {
          const todosFromServer = await getTodos(user.id);

          setTodos(todosFromServer);
        }
      } catch {
        setErrorAlert(ErrorType.loadedError);
      } finally {
        setTodoTitle('');
      }

      setIsAdding(false);
      setCurrentTodo(0);
      setSelectedTodos([]);
    }, [],
  );

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  const loadTodoOnServer = useCallback(
    async () => {
      try {
        if (user?.id) {
          await createTodo(user.id, todoTitle);
          setDebounceTodoTitle('');
        }
      } catch (error) {
        setErrorAlert(ErrorType.addedError);
      } finally {
        loadTodosFromServer();
      }
    }, [debounceTodoTitle],
  );

  const deleteTodoFromServer = useCallback(
    async (idTodo: number) => {
      try {
        if (user?.id) {
          await deleteTodo(idTodo);

          setSelectedTodos([idTodo]);
        }
      } catch (error) {
        setErrorAlert(ErrorType.deletedError);
      } finally {
        loadTodosFromServer();
      }
    }, [],
  );

  const updateTodoOnServer = async (
    idTodo: number, data: Partial<Todo>,
  ) => {
    try {
      if (user?.id) {
        await updateTodo(idTodo, data);
      }
    } catch {
      setErrorAlert(ErrorType.updatedError);
    } finally {
      loadTodosFromServer();
    }
  };

  const handleClearCompletedTodos = () => {
    setSelectedTodos(completedTodos.map(todo => todo.id));

    completedTodos.map(todo => deleteTodoFromServer(todo.id));
  };

  const handleAddTodoToTheList = (eventSubmit: React.FormEvent) => {
    eventSubmit.preventDefault();
    if (!todoTitle) {
      setErrorAlert(ErrorType.titleError);

      return;
    }

    setIsAdding(true);

    loadTodoOnServer();
  };

  const isActiveToggleAllButton = completedTodos.length === todos.length;

  const handleChangeToggleAllButton = () => {
    const todosList = isActiveToggleAllButton
      ? [...completedTodos]
      : [...notCompletedTodos];

    setSelectedTodos(todosList.map(todo => todo.id));

    todosList.forEach(
      todo => updateTodoOnServer(
        todo.id, { completed: !isActiveToggleAllButton },
      ),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">

        <Header
          todos={todos}
          todoTitle={todoTitle}
          isAdding={isAdding}
          isActiveToggleAllButton={isActiveToggleAllButton}
          setTodoTitle={setTodoTitle}
          applyTodoTitle={applyTodoTitle}
          handleAddTodoToTheList={handleAddTodoToTheList}
          handleChangeToggleAllButton={handleChangeToggleAllButton}
        />

        {(isAdding || todos.length > 0) && (
          <TodoList
            visibleTodo={visibleTodo}
            isAdding={isAdding}
            isClicked={isClicked}
            todoTitle={todoTitle}
            currentTodo={currentTodo}
            selectedTodos={selectedTodos}
            setTodoTitle={setTodoTitle}
            setIsClicked={setIsClicked}
            setCurrentTodo={setCurrentTodo}
            deleteTodoFromServer={deleteTodoFromServer}
            updateTodoOnServer={updateTodoOnServer}
            setSelectedTodos={setSelectedTodos}
          />
        )}

        {(todos.length > 0) && (
          <Footer
            filteredType={filteredType}
            notCompletedTodos={notCompletedTodos}
            completedTodos={completedTodos}
            setFilteredType={setFilteredType}
            handleClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      {errorAlert !== null && (
        <ErrorNotification
          errorAlert={errorAlert}
          setIsAdding={setIsAdding}
          setErrorAlert={setErrorAlert}
        />
      )}
    </div>
  );
};
