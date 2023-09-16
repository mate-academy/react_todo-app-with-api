import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { updateTodo, deleteTodo, getTodos } from './api/todos';
import { ErrorTypes, FilterValues, USER_ID } from './constants';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './components/UserWarning';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [errorType, setErrorType] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FilterValues.ALL);
  const [removingTodoIds, setRemovingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');

  const activeTodos = todos.filter(todoItem => !todoItem.completed);
  const completedTodos = todos.filter(todoItem => todoItem.completed);
  const isEveryTodosCompleted = todos.every(todoItem => todoItem.completed);
  const hasCompletedTodo = todos.some(todo => todo.completed);

  const activeTodosIds = todos
    .filter(todo => !todo.completed)
    .map((todo) => todo.id);

  const completedTodosIds = todos
    .filter(todo => todo.completed)
    .map((todo) => todo.id);

  const filteredTodos = todos.filter(todo => {
    switch (selectedFilter) {
      case FilterValues.COMPLETED:
        return todo.completed;

      case FilterValues.ACTIVE:
        return !todo.completed;

      default: return true;
    }
  });

  const getTodosFromServer = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error) {
      setErrorType(ErrorTypes.UPLOAD);
    }
  };

  const deleteTodoFromServer = useCallback(async (todoId: number) => {
    setRemovingTodoIds(prevTodoIds => [...prevTodoIds, todoId]);

    try {
      await deleteTodo(todoId);

      const updatedTodos = todos.filter(todo => todo.id !== todoId);

      setTodos(updatedTodos);
    } catch (error) {
      setErrorType(ErrorTypes.DELETE);
    } finally {
      setRemovingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id === todoId));
    }
  }, [todos]);

  const clearCompletedTodos = useCallback(async () => {
    setRemovingTodoIds(completedTodosIds);

    Promise.all(completedTodosIds.map((id) => deleteTodo(id)))
      .then(() => {
        setTodos(activeTodos);
      })
      .catch(() => {
        setErrorType(ErrorTypes.DELETE);
      })
      .finally(() => setRemovingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => !completedTodosIds.includes(id))));
  }, [hasCompletedTodo, activeTodos]);

  const changeTodoStatus = useCallback(async (todo: Todo) => {
    setUpdatingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });

      const updatedTodos = todos.map(todoItem => {
        if (todoItem.id === updatedTodo.id) {
          return updatedTodo;
        }

        return todoItem;
      });

      setTodos(updatedTodos);
    } catch (error) {
      setErrorType(ErrorTypes.UPDATE);
    } finally {
      setUpdatingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id !== todo.id));
    }
  }, [activeTodosIds, completedTodosIds]);

  const changeTodoTitle = useCallback(async (
    todo: Todo,
    newTitle: string,
  ) => {
    setUpdatingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        title: newTitle,
      });

      const updatedTodos = todos.map(todoItem => {
        if (todoItem.id === updatedTodo.id) {
          return updatedTodo;
        }

        return todoItem;
      });

      setTodos(updatedTodos);
    } catch (error) {
      setErrorType(ErrorTypes.UPDATE);
    } finally {
      setUpdatingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id !== todo.id));
    }
  }, [title, updatingTodoIds, todos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const toggleAll = useCallback(async () => {
    const updateActive = () => {
      return todos.map(todo => {
        setUpdatingTodoIds(activeTodosIds);

        if (!todo.completed) {
          return updateTodo(todo.id, {
            ...todo,
            completed: !todo.completed,
          });
        }

        return todo;
      });
    };

    const handleUpdateCompleted = () => {
      return completedTodos.map(todo => {
        setUpdatingTodoIds(completedTodosIds);

        return updateTodo(todo.id, {
          ...todo,
          completed: !todo.completed,
        });
      });
    };

    const updatingTodos = isEveryTodosCompleted
      ? handleUpdateCompleted()
      : updateActive();

    Promise.all(updatingTodos)
      .then((response) => setTodos(response))
      .catch(() => {
        setErrorType(ErrorTypes.UPDATE);
      })
      .finally(() => setUpdatingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => updatingTodoIds.includes(id))));
  }, [changeTodoStatus, completedTodos, activeTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          todos={todos}
          setTodos={setTodos}
          setTitle={setTitle}
          setTempTodo={setTempTodo}
          setErrorType={setErrorType}
          toggleAll={toggleAll}
          isToggleAllActive={isEveryTodosCompleted}
        />
        {(!!todos.length || tempTodo) && (
          <>
            <TodoList
              tempTodo={tempTodo}
              todos={filteredTodos}
              removingTodoIds={removingTodoIds}
              deleteTodoFromServer={deleteTodoFromServer}
              updatingTodoIds={updatingTodoIds}
              setUpdatingTodoIds={setUpdatingTodoIds}
              changeTodoStatus={changeTodoStatus}
              changeTodoTitle={changeTodoTitle}

            />

            <Footer
              todos={todos}
              selectedFilter={selectedFilter}
              onChange={setSelectedFilter}
              clearCompletedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>
      {errorType && (
        <ErrorNotification
          errorType={errorType}
        />
      )}
    </div>
  );
};
