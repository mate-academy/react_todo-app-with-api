import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoNotification } from './components/TodoNotification';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api/todos';
import { TodoStatus } from './types/TodoStatus';
import { Todo } from './types/Todo';
import { TodoListContext } from './context/TodoListContext';

const USER_ID = 10509;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(TodoStatus.All);
  const [hasError, setHasError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedTodoIdList, setCompletedTodoIdList] = useState<number[]>([]);

  const showErrorMessage = (message: string) => {
    setHasError(true);
    setErrorMessage(message);
  };

  const handleCloseButton = useCallback(() => {
    setHasError(!hasError);
  }, [hasError]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterBy === TodoStatus.Active) {
        return !todo.completed;
      }

      if (filterBy === TodoStatus.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filterBy]);

  const activeTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const areAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const toggleAllTodos = useCallback(async () => {
    const todosToToggle = areAllTodosCompleted
      ? todos.filter(todo => todo.completed)
      : todos.filter(todo => !todo.completed);

    setCompletedTodoIdList(todosToToggle.map(todo => todo.id));

    try {
      const updatedTodos = await Promise.all(todosToToggle
        .map(todo => updateTodo(todo.id, { completed: !todo.completed })));

      setTodos(currTodos => currTodos.map(todo => {
        const updatedTodo = updatedTodos.find(task => task.id === todo.id);

        return updatedTodo || todo;
      }));
    } catch {
      showErrorMessage('Unable to update the todos');
    } finally {
      setCompletedTodoIdList([]);
    }
  }, [todos]);

  const handleEnterKeyPress = useCallback((title: string) => {
    setTempTodo({
      id: parseInt(uuidv4(), 16),
      userId: USER_ID,
      title,
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title,
      completed: false,
    })
      .then(fetchedTodo => setTodos(currTodos => [...currTodos, fetchedTodo]))
      .catch(() => showErrorMessage('Unable to add a todo'))
      .finally(() => setTempTodo(null));
  }, []);

  const handleToggleButtonClick = useCallback(async (
    todoId: number,
    completed: boolean,
  ) => {
    setCompletedTodoIdList([todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, { completed: !completed });

      setTodos(currTodos => currTodos.map(todo => {
        return todo.id === todoId
          ? updatedTodo
          : todo;
      }));
    } catch {
      showErrorMessage('Unable to update a todo');
    } finally {
      setCompletedTodoIdList([]);
    }
  }, [todos]);

  const handleTodoRename = useCallback(async (
    todoId: number,
    title: string,
  ) => {
    setCompletedTodoIdList([todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, { title });

      setTodos(currTodos => currTodos.map(todo => {
        return todo.id === todoId
          ? updatedTodo
          : todo;
      }));
    } catch {
      showErrorMessage('Unable to update a todo');
    } finally {
      setCompletedTodoIdList([]);
    }
  }, [todos]);

  const handleRemoveButtonClick = useCallback(async (todoId: number) => {
    setCompletedTodoIdList([todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      showErrorMessage('Unable to delete a todo');
    } finally {
      setCompletedTodoIdList([]);
    }
  }, [todos]);

  const handleFilterBy = useCallback((str: TodoStatus) => {
    setFilterBy(str);
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    const completedTodoIds = todos.filter(todo => todo.completed)
      .map(todo => todo.id);

    setCompletedTodoIdList(completedTodoIds);
    try {
      await Promise.all(completedTodoIds.map(todoId => deleteTodo(todoId)));

      setTodos(todos.filter(todo => !completedTodoIds.includes(todo.id)));
    } catch {
      showErrorMessage('Unable to delete the todos');
    } finally {
      setCompletedTodoIdList([]);
    }
  }, [todos]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasError(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showErrorMessage]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todoList => setTodos(todoList))
      .catch(() => showErrorMessage('Unable to load todos'));
  }, [USER_ID]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isToggleAllButtonVisible={!!todos.length}
          isTempTodoTrue={!!tempTodo}
          showErrorMessage={showErrorMessage}
          onEnterKeyPress={handleEnterKeyPress}
          onToggleAllButtonClick={toggleAllTodos}
          areAllTodosCompleted={areAllTodosCompleted}
        />

        <TodoListContext.Provider value={{
          visibleTodos,
          tempTodo,
          completedTodoIdList,
          handleTodoRename,
          handleToggleButtonClick,
          handleRemoveButtonClick,
        }}
        >
          <TodoList />
        </TodoListContext.Provider>

        {todos.length > 0 && (
          <TodoFooter
            filter={filterBy}
            itemsLeft={activeTodosCount}
            onFilter={handleFilterBy}
            onClearCompleted={clearCompletedTodos}
            completedCount={todos.length - activeTodosCount}
          />
        )}
      </div>

      <TodoNotification
        hasError={hasError}
        errorMessage={errorMessage}
        onCloseButton={handleCloseButton}
      />
    </div>
  );
};
