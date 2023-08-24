import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { USER_ID } from './App.constants';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorMessage } from './components/ErrorMessage';
import { changeTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/FilterEnum';
import { TodoHeader } from './components/TodoHeader';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');

  const activeTodosCounter = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  const completedTodosCounter = useMemo(() => (
    todos.length - activeTodosCounter
  ), [todos, activeTodosCounter]);

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage('Unable to load todos');
    }
  }, []);

  const addTodo = useCallback(async (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, []);

  const handleChangeTodo = useCallback(async (updatingTodo: Todo) => {
    setTodos(prevTodos => prevTodos.map((todo) => {
      if (todo.id === updatingTodo.id) {
        return updatingTodo;
      }

      return todo;
    }));
  }, []);

  const handleAllTodosStatusChange = async () => {
    try {
      const allCompleted = todos.every(todo => todo.completed);

      await Promise.all(
        todos.map(async todo => {
          const allTodosForStatusChange = changeTodo(todo.id, {
            ...todo,
            completed: !allCompleted,
          });

          return handleChangeTodo(await allTodosForStatusChange);
        }),
      );

      setTodos(prevTodos => prevTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
      })));
    } catch {
      setErrorMessage('Unable to update todos');
    }
  };

  const deleteTodo = useCallback(async (deletingTodo: Todo) => {
    try {
      await removeTodo(deletingTodo.id);
      loadTodos();
    } catch {
      setErrorMessage('Unable to delete todo');
    }

    setTempTodo(null);
  }, []);

  const deleteCompletedTodos = useCallback(async () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    completedTodos.map(todo => {
      return deleteTodo(todo);
    });
  }, [todos]);

  const closeError = useCallback(() => {
    setErrorMessage('');
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.ACTIVE:
        return todos.filter((todo) => !todo.completed);
      case Filter.COMPLETED:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          activeTodosCounter={activeTodosCounter}
          handleAllTodosStatusChange={handleAllTodosStatusChange}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          handleChangeTodo={handleChangeTodo}
          setErrorMessage={setErrorMessage}
        />

        {todos.length > 0 && (
          <TodoFooter
            itemCounter={activeTodosCounter}
            completedTodosCounter={completedTodosCounter}
            selectedFilter={filter}
            onFilterSelect={setFilter}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          onClose={closeError}
        />
      )}
    </div>
  );
};
