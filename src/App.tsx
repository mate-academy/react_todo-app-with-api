/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import * as todoMethods from './api/todo';
import { ErrorNotification } from './components/Error';
import { FilterStatus } from './types/FilterStatus';
import getTodosFilter from './utils/getTodosFilter';
import { ErrorMessage } from './types/ErrorMessage';

type ProcessingState = {
  deleting: number[];
  updating: number[];
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    deleting: [],
    updating: [],
  });
  const [isInputDisabled, setInputDisabled] = useState(false);

  const todosActiveQuantity = todos.filter(todo => !todo.completed).length;
  const todosComplitedQuantity = todos.filter(todo => todo.completed).length;
  const allTodosIsComplited =
    todos.length > 0 && todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isInputDisabled]);

  useEffect(() => {
    todoMethods
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.LOAD));
  }, []);

  const filteredTodos = useMemo((): Todo[] => {
    const filterTodos = getTodosFilter(filterStatus);

    return filterTodos ? filterTodos(todos) : todos;
  }, [filterStatus, todos]);

  const addTodo = async (title: string): Promise<void> => {
    const userId = todoMethods.USER_ID;
    const temporaryTodo: Todo = {
      id: 0,
      userId,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setInputDisabled(true);

    try {
      const newTodo = await todoMethods.createTodo({
        userId,
        title,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch {
      showError(ErrorMessage.ADD);
      throw new Error();
    } finally {
      setTempTodo(null);
      setInputDisabled(false);
    }
  };

  const deleteTodo = async (todoId: number): Promise<void> => {
    setProcessing(prev => ({ ...prev, deleting: [...prev.deleting, todoId] }));
    setInputDisabled(true);

    try {
      await todoMethods.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorMessage.DELETE);
      throw new Error();
    } finally {
      setProcessing(prev => ({
        ...prev,
        deleting: prev.deleting.filter(id => id !== todoId),
      }));
      setInputDisabled(false);
    }
  };

  const clearAllComplitedTodos = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedTodoIds.length === 0) {
      return;
    }

    setProcessing(prev => ({ ...prev, deleting: completedTodoIds }));
    setInputDisabled(true);

    Promise.all(completedTodoIds.map(deleteTodo)).finally(() => {
      setProcessing(prev => ({ ...prev, deleting: [] }));
      setInputDisabled(false);
    });
  };

  const updateTodo = async (todo: Todo) => {
    setProcessing(prev => ({ ...prev, updating: [...prev.updating, todo.id] }));
    const prevTodo = todos.find(t => t.id === todo.id);

    try {
      const updatedTodo = await todoMethods.updateTodo(todo);

      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
        ),
      );
    } catch {
      // ✅ відкат до попереднього стану
      if (prevTodo) {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === prevTodo.id ? prevTodo : currentTodo,
          ),
        );
      }

      showError(ErrorMessage.UPDATE);
      throw new Error();
    } finally {
      setProcessing(prev => ({
        ...prev,
        updating: prev.updating.filter(id => id !== todo.id),
      }));
    }
  };

  const toggleTodos = async () => {
    const targetStatus = !allTodosIsComplited;
    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    try {
      for (const todo of todosToUpdate) {
        await updateTodo({ ...todo, completed: targetStatus });
      }
    } catch {
      showError(ErrorMessage.UPDATE);
      throw new Error();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={isInputDisabled}
          inputRef={inputRef}
          allTodosIsComplited={allTodosIsComplited}
          hasTodos={todos.length > 0} // ✅ заміна isTodosEmpty
          toggleTodos={toggleTodos}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          deletingTodoIds={processing.deleting}
          updatingTodoIds={processing.updating}
          tempTodo={tempTodo}
          updateTodo={updateTodo}
        />

        {todos.length > 0 && (
          <Footer
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            todosActiveQuantity={todosActiveQuantity}
            todosComplitedQuantity={todosComplitedQuantity}
            clearAllComplitedTodos={clearAllComplitedTodos}
          />
        )}
      </div>

      <ErrorNotification error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
