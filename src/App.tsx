/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
  USER_ID,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { ErrorMessages } from './types/ErrorMessages';
import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';
import { closeNotification } from './utils/closeNotification';
import { getVisibleTodos } from './utils/getVisibleTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [
    errorMessage,
    setErrorMessage,
  ] = useState<ErrorMessages>(ErrorMessages.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isUpdatingTodoId, setIsUpdatingTodoId] = useState(0);

  const showError = useCallback((message: ErrorMessages) => {
    setHasError(true);
    setErrorMessage(message);
    closeNotification(setHasError, false, 3000);
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      const fetchedTodos = await getTodos();

      setTodos(fetchedTodos);
    } catch {
      showError(ErrorMessages.ONLOAD);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(todos, filterBy)
  ), [todos, filterBy]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);
  const activeTodosLeft = activeTodos.length;
  const hasActiveTodos = activeTodos.length > 0;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const changeTodoTitle = useCallback((newTitle: string) => {
    setTodoTitle(newTitle);
  }, []);

  const changeFilterBy = useCallback((filter: FilterBy) => {
    setFilterBy(filter);
  }, []);

  const changeHasError = useCallback((value: boolean) => {
    setHasError(value);
  }, []);

  const handleAddTodo = useCallback(async (title: string) => {
    if (!title.trim()) {
      showError(ErrorMessages.ONTITLE);

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: USER_ID,
      completed: false,
      title,
    };

    try {
      setIsInputDisabled(true);
      setTodoTitle('');

      const newTodo = await addTodo(todoToAdd);

      setTempTodo(newTodo);

      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        showError(ErrorMessages.ONLOAD);
      }
    } catch {
      showError(ErrorMessages.ONADD);
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoToDelete: Todo) => {
    try {
      await deleteTodo(todoToDelete.id);

      setTodos(curTodos => (
        curTodos.filter(todo => todo.id !== todoToDelete.id)
      ));
    } catch {
      showError(ErrorMessages.ONDELETE);
    }
  }, []);

  const handleDeleteCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo));
  }, [todos]);

  const handleUpdateTodoStatus = async (
    todoToUpdate: Todo,
  ) => {
    const newStatus = !todoToUpdate.completed;

    try {
      setIsUpdatingTodoId(todoToUpdate.id);

      const updatedTodo: Todo = await updateTodoStatus(
        todoToUpdate.id,
        newStatus,
      );

      setTodos(curTodos => (
        curTodos.map(todo => (
          todo.id === todoToUpdate.id
            ? updatedTodo
            : todo
        ))
      ));
    } catch {
      showError(ErrorMessages.ONUPDATE);
    } finally {
      setIsUpdatingTodoId(0);
    }
  };

  const handleStatusOfAllTodos = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos
      .filter(todo => todo.completed !== !isAllCompleted);

    todosToUpdate.forEach(todo => {
      handleUpdateTodoStatus(todo);
    });
  };

  const handleUpdateTodoTitle = async (
    todoToUpdate: Todo,
    newTitle: string,
  ) => {
    try {
      setIsUpdatingTodoId(todoToUpdate.id);

      const updatedTodo: Todo = await updateTodoTitle(
        todoToUpdate.id,
        newTitle,
      );

      setTodos(curTodos => {
        return curTodos.map(todo => (
          todo.id === todoToUpdate.id
            ? updatedTodo
            : todo
        ));
      });
    } catch {
      showError(ErrorMessages.ONUPDATE);
    } finally {
      setIsUpdatingTodoId(0);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={todoTitle}
          hasActiveTodos={hasActiveTodos}
          onTitleChange={changeTodoTitle}
          isInputDisabled={isInputDisabled}
          onAddTodo={handleAddTodo}
          todos={todos}
          handleUpdateAllTodosStatus={handleStatusOfAllTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={handleDeleteTodo}
              handleUpdateTodoStatus={handleUpdateTodoStatus}
              isUpdatingTodoId={isUpdatingTodoId}
              handleUpdateTodoTitle={handleUpdateTodoTitle}
            />

            <Footer
              activeTodosLeft={activeTodosLeft}
              hasCompletedTodos={hasCompletedTodos}
              filterBy={filterBy}
              onFilterBy={changeFilterBy}
              onDeleteCompletedTodos={handleDeleteCompletedTodos}
            />
          </>
        )}
      </div>

      <Notification
        hasError={hasError}
        errorMessage={errorMessage}
        onHasError={changeHasError}
      />
    </div>
  );
};
