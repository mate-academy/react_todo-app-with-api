import React, { useState, useEffect, useRef } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './components/UserWarning';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { flushSync } from 'react-dom';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [selectedTodoNewValue, setSelectedTodoNewValue] = useState<string>('');

  const isAllTodosCompleted = todos.every(todo => todo.completed);

  function setErrorAndTimeout(value: string) {
    setErrorMessage(value);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorAndTimeout('Unable to load todos'));
  }, []);

  function setTodoCompleted(todoId: number, completed: boolean) {
    setTodos(prevTodos => {
      return prevTodos.map(t => (t.id === todoId ? { ...t, completed } : t));
    });
  }

  function setTodoLoading(todoId: number, loading: boolean) {
    if (loadingTodoIds.includes(todoId)) {
      return;
    }

    setLoadingTodoIds((prevLoadingTodoIds: number[]) => {
      if (loading) {
        return [...prevLoadingTodoIds, todoId];
      } else {
        return prevLoadingTodoIds.filter((id: number) => id !== todoId);
      }
    });
  }

  async function handleAddTodo() {
    const title = inputValue.trim();

    if (title.length === 0) {
      setErrorAndTimeout('Title should not be empty');

      return;
    }

    const todoData = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ id: 0, ...todoData });

    try {
      const newTodo = await addTodo(todoData);

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputValue('');
    } catch {
      setErrorAndTimeout('Unable to add a todo');
    } finally {
      flushSync(() => {
        setTempTodo(null);
      });

      inputRef.current?.focus();
    }
  }

  function handleTodoSelect(todoId: number, title: string) {
    setSelectedTodoId(todoId);
    setSelectedTodoNewValue(title);
  }

  function handleTodoDeselect() {
    setSelectedTodoId(null);
    setSelectedTodoNewValue('');
  }

  async function handleRemoveTodo(todoId: number) {
    setLoadingTodoIds(prevLoadingTodoIds => [...prevLoadingTodoIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorAndTimeout('Unable to delete a todo');
    } finally {
      setTodoLoading(todoId, false);
      inputRef.current?.focus();
    }
  }

  async function handleRemoveEditingTodo(todoId: number) {
    setLoadingTodoIds(prevLoadingTodoIds => [...prevLoadingTodoIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      handleTodoDeselect();
    } catch {
      setErrorAndTimeout('Unable to delete a todo');
    } finally {
      setTodoLoading(todoId, false);
    }
  }

  async function handleTodoCompleteChange(todoId: number, completed: boolean) {
    if (loadingTodoIds.includes(todoId)) {
      return;
    }

    setTodoLoading(todoId, true);
    setTodoCompleted(todoId, completed);

    try {
      await updateTodo(todoId, { completed });
    } catch {
      setErrorAndTimeout('Unable to update a todo');
      setTodoCompleted(todoId, !completed);
    } finally {
      setTodoLoading(todoId, false);
    }
  }

  async function handleTodoTitleChange(todo: Todo, newTitle: string) {
    if (todo.title === newTitle.trim()) {
      handleTodoDeselect();

      return;
    }

    setTodoLoading(todo.id, true);

    if (newTitle.trim() === '') {
      handleRemoveEditingTodo(todo.id);

      return;
    }

    setTodos((prevTodos: Todo[]) => {
      return prevTodos.map(t =>
        t.id === todo.id ? { ...t, title: newTitle.trim() } : t,
      );
    });

    try {
      await updateTodo(todo.id, { title: newTitle.trim() });
      handleTodoDeselect();
    } catch {
      setErrorAndTimeout('Unable to update a todo');

      setTodos((prevTodos: Todo[]) => {
        return prevTodos.map(t => (t.id === todo.id ? todo : t));
      });
    } finally {
      setTodoLoading(todo.id, false);
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isAllTodosCompleted={isAllTodosCompleted}
          onTodoCompleteChange={handleTodoCompleteChange}
          inputDisabled={tempTodo !== null}
          onAddTodo={handleAddTodo}
          inputRef={inputRef}
          onInputChange={setInputValue}
          inputValue={inputValue}
        />

        <TodoList
          todos={todos}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          onTodoCompleteChange={handleTodoCompleteChange}
          onTodoRemove={handleRemoveTodo}
          onTodoTitleChange={handleTodoTitleChange}
          onTodoSelect={handleTodoSelect}
          onTodoDeselect={handleTodoDeselect}
          selectedTodoId={selectedTodoId}
          selectedTodoNewValue={selectedTodoNewValue}
          onSelectedTodoNewValueChange={setSelectedTodoNewValue}
          filterType={filterType}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            onTodoRemove={handleRemoveTodo}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} />
    </div>
  );
};
