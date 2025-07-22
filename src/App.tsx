/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  postTodo,
  updateTodo,
  USER_ID,
  getTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const focusRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosFilter, setTodosFilter] = useState(FilterType.All);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();
  const [todoBeingAdded, setTodoBeingAdded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [clearInput, setClearInput] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [togglingIds, setTogglingIds] = useState<number[]>([]);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const loadTodos = async () => {
    try {
      const fetchedTodos = await getTodos();

      setTodos(fetchedTodos);
    } catch {
      showError('Unable to load todos');
    } finally {
      focusRef.current?.focus();
    }
  };

  const handlePostTodo = async (todoToPost: Todo | null) => {
    if (!todoToPost) {
      return;
    }

    setTodoBeingAdded(true);
    setTempTodo({ ...todoToPost, id: 0 });

    try {
      const newTodo = await postTodo(todoToPost);

      setTodos(prev => [...prev, newTodo]);
      setClearInput(true);
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTodoBeingAdded(false);
      setTempTodo(null);
      focusRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (todoToDelete: Todo | null) => {
    if (!todoToDelete) {
      return;
    }

    try {
      await deleteTodo(todoToDelete);
      setTodos(prev => prev.filter(t => t.id !== todoToDelete.id));

      if (todoToDelete === selectedTodo) {
        setSelectedTodo(undefined);
      }
    } catch {
      showError('Unable to delete a todo');
    } finally {
      focusRef.current?.focus();
    }
  };

  const handleUpdateTodo = async (todoToUpdate: Todo | null) => {
    if (!todoToUpdate) {
      return;
    }

    try {
      await updateTodo(todoToUpdate);
      setTodos(prev =>
        prev.map(todo => (todo.id === todoToUpdate.id ? todoToUpdate : todo)),
      );
    } catch {
      showError('Unable to update a todo');
    } finally {
      if (todoToUpdate === selectedTodo) {
        setSelectedTodo(undefined);
      }

      focusRef.current?.focus();
    }
  };

  const handleToggleAll = async () => {
    const shouldComplete = todos.some(todo => !todo.completed);

    const updateOps = todos.map(todo =>
      todo.completed !== shouldComplete
        ? updateTodo({ ...todo, completed: shouldComplete })
        : Promise.resolve(),
    );

    const results = await Promise.allSettled(updateOps);

    if (results.some(r => r.status === 'rejected')) {
      showError('Unable to update some todos');
    }

    setTodos(prev =>
      prev.map(todo => ({ ...todo, completed: shouldComplete })),
    );

    setTogglingIds([]);
    focusRef.current?.focus();
  };

  const handleDeleteCompleted = () => {
    todos.filter(t => t.completed).forEach(handleDeleteTodo);
    focusRef.current?.focus();
  };

  const filteredTodos =
    todosFilter === FilterType.All
      ? todos
      : todos.filter(todo =>
        todosFilter === FilterType.Active ? !todo.completed : todo.completed,
      );

  useEffect(() => {
    if (!todoBeingAdded) {
      focusRef.current?.focus();
    }
  }, [todoBeingAdded]);

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          focusRef={focusRef}
          todos={todos}
          postNewTodo={handlePostTodo}
          showError={showError}
          todoBeingAdded={todoBeingAdded}
          clearInput={clearInput}
          setClearInput={setClearInput}
          toggleTodoCompletedStatus={handleToggleAll}
          setTogglingIds={setTogglingIds}
        />

        <TodoList
          filteredTodos={filteredTodos}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          deleteChosenTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          updateChosenTodo={handleUpdateTodo}
          deletingIds={deletingIds}
          togglingIds={togglingIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            todosFilter={todosFilter}
            setTodosFilter={setTodosFilter}
            deleteCompletedTodos={handleDeleteCompleted}
            setDeletingIds={setDeletingIds}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
