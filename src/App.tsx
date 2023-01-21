import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from './types/Todo';
import {
  createTodo, getTodos, removeTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { TodosFooter } from './components/TodosFooter';
import { ErrorBlock } from './components/ErrorBlock';
import { FilterState } from './types/FilterState';
import { TodosHeader } from './components/TodosHeader';
import { CustomError } from './types/CustomError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const initialError = { active: false, messages: [] };
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<CustomError>(initialError);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState<Todo>();
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [filterState, setFilterState] = useState<FilterState>(FilterState.All);

  const todoFilterStatePredicate = (todo: Todo) => {
    switch (filterState) {
      case FilterState.Active:
        return !todo.completed;
      case FilterState.Completed:
        return todo.completed;
      default:
        return true;
    }
  };

  const renderedTodos
    = useMemo(
      () => todos.filter(todoFilterStatePredicate), [todos, filterState],
    );
  const activeTodos
    = useMemo(() => todos.filter(todo => !todo.completed), [todos]);

  const completedTodos
    = useMemo(() => todos.filter(todo => todo.completed), [todos]);

  const toggleError = (active: false) => {
    setError((prevState) => ({
      ...prevState,
      active,
    }));
  };

  const handleError = (message = '') => {
    if (!message.length) {
      toggleError(false);
    } else {
      setError({ active: true, messages: [message] });
      setTimeout(() => {
        toggleError(false);
      }, 3000);
    }
  };

  const patchTodo = async (todo: Todo, patch: Partial<Todo>) => {
    try {
      setLoadingTodos(prevState => prevState.concat(todo.id));
      const updatedTodo = { ...todo, ...patch };

      await updateTodo(updatedTodo);

      setTodos(
        prevState => prevState.map(
          item => (item.id === todo.id ? updatedTodo : item),
        ),
      );
    } catch {
      handleError('Unable to update a todo.');
    } finally {
      setLoadingTodos(
        prevState => prevState.filter(todoId => todoId !== todo.id),
      );
    }
  };

  const toggleTodo = async (todo: Todo) => {
    await patchTodo(todo, { completed: !todo.completed });
  };

  const toggleAll = async (toggleTo: boolean) => {
    const promiseArray = toggleTo
      ? completedTodos.map(todo => toggleTodo(todo))
      : activeTodos.map(todo => toggleTodo(todo));

    await Promise.all(promiseArray);
  };

  const editTitle = async (todo: Todo, newTitle: string) => {
    await patchTodo(todo, { title: newTitle });
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setLoadingTodos(prevState => prevState.concat(todoId));
      await removeTodo(todoId);

      setTodos(prevState => prevState.filter(todo => todo.id !== todoId));
    } catch {
      handleError('Unable to delete a todo.');
    } finally {
      setLoadingTodos(
        prevState => prevState.filter(todoID => todoID !== todoId),
      );
    }
  };

  const deleteCompletedTodos = async () => {
    const promiseArray = completedTodos.map(todo => deleteTodo(todo.id));

    await Promise.all(promiseArray);
  };

  const addTodo = async (title: string) => {
    if (title.trim().length === 0) {
      handleError("Title can't be empty");

      return;
    }

    const preparedTodo = {
      id: 0,
      title,
      userId: user?.id || 0,
      completed: false,
    };

    setIsAdding(true);
    setNewTodo(preparedTodo);

    try {
      const createdTodo = await createTodo(preparedTodo);

      setTodos((prevState) => prevState.concat(createdTodo));
    } catch {
      handleError("Couldn't add todo.");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    async function fetchTodos() {
      if (!user) {
        return;
      }

      try {
        const fetchedTodos = await getTodos(user.id);

        setTodos(fetchedTodos);
      } catch {
        handleError("Couldn't load todos.");
      }
    }

    fetchTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          todos={todos}
          activeTodosAmount={activeTodos.length}
          onAddTodo={addTodo}
          isAdding={isAdding}
          onToggleAll={toggleAll}
        />

        <TodoList
          todos={renderedTodos}
          newTodo={newTodo}
          isAdding={isAdding}
          onItemRemove={deleteTodo}
          loadingTodos={loadingTodos}
          onItemCheck={toggleTodo}
          onEdit={editTitle}
        />

        {(todos.length > 0 || isAdding) && (
          <TodosFooter
            activeNumber={activeTodos.length}
            completedNumber={completedTodos.length}
            selectedFilter={filterState}
            onFilterSelect={setFilterState}
            onClearCompletedClick={deleteCompletedTodos}
          />
        )}
      </div>
      <ErrorBlock
        error={error}
        onErrorClose={handleError}
      />
    </div>
  );
};
