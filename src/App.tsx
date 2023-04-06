import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  addTodo, deleteTodo, editTodo, getTodos,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterTypes';
import { Todo, TodoData } from './types/Todo';
import { Notification } from './components/Notification';
import { filterTodos } from './utils/filterTodos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const USER_ID = 6418;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tepmTodo, setTepmTodo] = useState<Todo | null>(null);
  const [todosIdInProcess, setTodosIdInProcess] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterType.ALL);

  const [hasLoadingError, sethasLoadingError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const activeTodos = filterTodos(todos, FilterType.ACTIVE);
  const visibleTodos = filterTodos(todos, selectedFilter);
  const completedTodos = filterTodos(todos, FilterType.COMPLETED);
  const completedTodosId = completedTodos.map(todo => todo.id);
  const isTodos = todos.length !== 0;

  const notify = (message: string) => {
    sethasLoadingError(true);
    setErrorMessage(message);

    setTimeout(() => {
      sethasLoadingError(false);
    }, 3000);
  };

  const getTodosFromServer = useCallback(async () => {
    sethasLoadingError(false);

    try {
      const fetchTodos = await getTodos(USER_ID);

      setTodos(fetchTodos);
    } catch {
      notify('Oppps smth went wrong with load todos...');
    }
  }, []);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const addTodoToServer = useCallback(async (title: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        title,
        completed: false,
      };

      setTepmTodo({
        ...newTodo,
        id: 0,
      });

      await addTodo(newTodo);
      await getTodosFromServer();
    } catch {
      notify('Cant add new todo to the Server ...');
    } finally {
      setTepmTodo(null);
    }
  }, []);

  const deleteTodoFromServer = useCallback(async (id: number) => {
    try {
      setTodosIdInProcess((prevState) => (
        [...prevState, id]
      ));
      await deleteTodo(id);
      await getTodosFromServer();
    } catch {
      notify('Unable to delete a todo');
    } finally {
      setTodosIdInProcess((prevState) => (
        prevState.filter(todoId => id !== todoId)
      ));
    }
  }, []);

  const editTodoOnServer = useCallback(
    async (todoId: number, data: TodoData) => {
      try {
        setTodosIdInProcess((prevState) => (
          [...prevState, todoId]
        ));
        await editTodo(todoId, data);
        await getTodosFromServer();
      } catch {
        notify('Unable to update a todo');
      } finally {
        setTodosIdInProcess((prevState) => (
          prevState.filter(id => id !== todoId)
        ));
      }
    }, [],
  );

  const handleCloseNotification = useCallback(() => {
    sethasLoadingError(false);
  }, []);

  const handleDeleteTodo = useCallback(
    (id: number) => {
      deleteTodoFromServer(id);
    }, [],
  );

  const handleFilterSelect = useCallback((filterType: FilterType) => {
    setSelectedFilter(filterType);
  }, []);

  const handleClearCompletedTodos = useCallback(async () => {
    try {
      setTodosIdInProcess((prevState) => (
        [...prevState, ...completedTodosId]
      ));
      await Promise.all(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );
      await getTodosFromServer();
    } catch {
      notify('Unable to delete a todo...');
    } finally {
      setTodosIdInProcess((prevState) => (
        prevState.filter(todoId => !completedTodosId.includes(todoId))
      ));
    }
  }, [completedTodos]);

  const handleToggleComplete = useCallback(async (todo: Todo) => {
    await editTodoOnServer(todo.id, { completed: !todo.completed });
  }, []);

  const handleEditTodo = useCallback(async (todo: Todo) => {
    await editTodoOnServer(todo.id, { title: todo.title });
  }, []);

  const handleToggleAll = useCallback(
    async () => {
      const toggle = activeTodos.length ? activeTodos : todos;
      const todoId = toggle.map(todo => todo.id);

      try {
        setTodosIdInProcess((prevState) => (
          [...prevState, ...todoId]
        ));
        await Promise.all(
          toggle.map(todo => (
            editTodo(todo.id, { completed: !todo.completed })
          )),
        );
        getTodosFromServer();
      } catch {
        notify('Unable to update a todo');
      } finally {
        setTodosIdInProcess((prevState) => (
          prevState.filter(id => !todoId.includes(id))
        ));
      }
    }, [activeTodos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodoToServer={addTodoToServer}
          todos={todos}
          completedTodos={completedTodos}
          notify={notify}
          handleToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tepmTodo}
          onDeleteTodo={handleDeleteTodo}
          todosIdInProcess={todosIdInProcess}
          onToggleComplete={handleToggleComplete}
          onHandleEditTodo={handleEditTodo}
        />

        {isTodos && (
          <Footer
            selectedFilter={selectedFilter}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            handleFilterSelect={handleFilterSelect}
            handleClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <Notification
        message={errorMessage}
        onClose={handleCloseNotification}
        hidden={!hasLoadingError}
      />
    </div>
  );
};
