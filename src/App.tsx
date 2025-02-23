/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorBox } from './components/ErrorBox';
import { UpdateTodo } from './types/Updates';
import { getFilteredTodos } from './helpers';
import { FilterType } from './enum/filterTypes';
import { ErrorMessages } from './enum/ErrorMassages';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const { Load, Add, Delete, Update, None } = ErrorMessages;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.None);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(FilterType.All);
  const [todoLoadingStates, setTodoLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayedTodos = getFilteredTodos(todos, filter);

  const errorTimerId = useRef(0);
  const showError = (message: ErrorMessages) => {
    setErrorMessage(message);
    window.clearTimeout(errorTimerId.current);
    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage(None);
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(Load));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTodoLoading = (id: number, loading: boolean) => {
    setTodoLoadingStates(prevState => ({ ...prevState, [id]: loading }));
  };

  const onAdd = async ({ userId, title, completed }: Todo) => {
    const newTempTodo: Todo = {
      id: 0,
      userId,
      title,
      completed,
    };

    setTempTodo(newTempTodo);

    try {
      setIsLoading(true);
      setTodoLoading(0, true);
      const newTodo = await todoService.createTodo({
        userId,
        title,
        completed,
      });

      setTodos(prev => [...prev, newTodo]);
      setTempTodo(null);
    } catch (error) {
      showError(Add);
      setTempTodo(null);
      throw error;
    } finally {
      setTodoLoading(0, false);
      setIsLoading(false);
    }
  };

  const onDelete = async (todoId: number) => {
    try {
      setTodoLoading(todoId, true);
      await todoService.deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      showError(Delete);
      throw error;
    } finally {
      setTodoLoading(todoId, false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const updateTodo = async ({ id, newData, keyValue }: UpdateTodo) => {
    try {
      setTodoLoading(id, true);
      await todoService.updateTodo(id, {
        [keyValue]: newData,
      });
      setTodos(prev =>
        prev.map(currentTodo =>
          id === currentTodo.id
            ? { ...currentTodo, [keyValue]: newData }
            : currentTodo,
        ),
      );
    } catch (error) {
      showError(Update);
      console.error('Error occurred while updating:', error);
    } finally {
      setTodoLoading(id, false);
    }
  };

  const onToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const updatePromises = todos
      .filter(todo => todo.completed !== newStatus)
      .map(todo => todoService.updateTodo(todo.id, { completed: newStatus }));

    const updatedTodos = todos.map(todo => ({ ...todo, completed: newStatus }));

    setTodos(updatedTodos);

    try {
      await Promise.all(updatePromises);
    } catch (error) {
      showError(Update);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onToggleAll={onToggleAll}
          showError={showError}
          isLoading={isLoading}
          inputRef={inputRef}
          onAdd={onAdd}
          todos={todos}
        />

        <TodoList
          todoLoadingStates={todoLoadingStates}
          updateTodo={updateTodo}
          todos={displayedTodos}
          onDelete={onDelete}
        />

        {tempTodo && (
          <div className="temp-todo">
            <TodoItem
              todoLoadingStates={{ 0: true }}
              updateTodo={updateTodo}
              onDelete={onDelete}
              todo={tempTodo}
            />
          </div>
        )}

        {!!todos.length && (
          <Footer
            setFilter={setFilter}
            onDelete={onDelete}
            filter={filter}
            todos={todos}
          />
        )}
      </div>

      <ErrorBox
        errorMessage={errorMessage}
        onClearError={() => {
          setErrorMessage(None);
        }}
      />
    </div>
  );
};
