import {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { ErrorMessage, Status, Todo } from './types';
import * as todoService from './api';
import {
  Header,
  ToggleAllButton,
  NewTodo,
  TodoList,
  TodoItem,
  Footer,
  TodoCounter,
  TodoFilter,
  ClearCompletedButton,
  ErrorNotification,
} from './components';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterValue, setFilterValue] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.None);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const clearErrorMessage = () => {
    setErrorMessage(ErrorMessage.None);
  };

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      clearErrorMessage();
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  const startProcessingTodo = (todo: Todo) => {
    setProcessingIds(currentIds => [...currentIds, todo.id]);
  };

  const stopProcessingTodo = (todo: Todo) => {
    setProcessingIds(currentIds => currentIds.filter(id => id !== todo.id));
  };

  const addTodoToState = (newTodo: Todo) => {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const replaceTodoInState = (updatedTodo: Todo) => {
    setTodos(currentTodos => {
      return currentTodos.map(currentTodo => (
        updatedTodo.id === currentTodo.id
          ? updatedTodo
          : currentTodo
      ));
    });
  };

  const removeTodoFromState = (todo: Todo) => {
    setTodos(currentTodos => {
      return currentTodos.filter(({ id }) => id !== todo.id);
    });
  };

  const handleAddTodo = useCallback((title: string) => {
    clearErrorMessage();
    setTempTodo({
      id: 0,
      userId: 0,
      title,
      completed: false,
    });

    return todoService.createTodo(title)
      .then(addTodoToState)
      .catch(() => {
        setErrorMessage(ErrorMessage.AddTodo);

        throw new Error(ErrorMessage.AddTodo);
      })
      .finally(() => setTempTodo(null));
  }, []);

  const handleDeleteTodo = useCallback((todo: Todo) => {
    clearErrorMessage();
    startProcessingTodo(todo);

    return todoService.deleteTodo(todo.id)
      .then(() => removeTodoFromState(todo))
      .catch(() => setErrorMessage(ErrorMessage.DeleteTodo))
      .finally(() => stopProcessingTodo(todo));
  }, []);

  const handleClearCompletedTodos = useCallback(() => {
    todos
      .filter(({ completed }) => completed)
      .forEach(handleDeleteTodo);
  }, [todos]);

  const handleToggleTodo = useCallback((todo: Todo) => {
    clearErrorMessage();
    startProcessingTodo(todo);

    todoService.toggleTodo(todo.id, todo.completed)
      .then(replaceTodoInState)
      .catch(() => setErrorMessage(ErrorMessage.UpdateTodo))
      .finally(() => stopProcessingTodo(todo));
  }, []);

  const handleToggleAllTodos = useCallback(() => {
    const hasActive = todos.some(({ completed }) => !completed);

    todos.forEach(todo => {
      if (hasActive && todo.completed) {
        return;
      }

      handleToggleTodo(todo);
    });
  }, [todos]);

  const handleEditTodo = useCallback((todo: Todo, title: string) => {
    clearErrorMessage();
    startProcessingTodo(todo);

    if (!title) {
      return handleDeleteTodo(todo);
    }

    return todoService.editTodo(todo.id, title)
      .then(replaceTodoInState)
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateTodo);

        throw new Error(ErrorMessage.UpdateTodo);
      })
      .finally(() => stopProcessingTodo(todo));
  }, []);

  const hasTodos = todos.length > 0 || !!tempTodo;
  const hasCompletedTodos = todos.some(({ completed }) => completed);
  const isAllCompleted = todos.every(({ completed }) => completed);
  const activeTodosCount = todos.filter(({ completed }) => !completed).length;
  const totalTodoCount = todos.length;

  const filteredTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (filterValue) {
      case Status.Active:
        return !completed;

      case Status.Completed:
        return completed;

      case Status.All:
      default:
        return true;
    }
  }), [todos, filterValue]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header>
          {hasTodos && (
            <ToggleAllButton
              active={isAllCompleted}
              onToggleAll={handleToggleAllTodos}
            />
          )}

          <NewTodo
            refocus={totalTodoCount}
            onAdd={handleAddTodo}
            onError={setErrorMessage}
          />
        </Header>

        {hasTodos && (
          <>
            <TodoList>
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  onToggle={handleToggleTodo}
                  onEdit={handleEditTodo}
                  processing={processingIds.includes(todo.id)}
                />
              ))}

              {tempTodo && (
                <TodoItem todo={tempTodo} processing />
              )}
            </TodoList>

            <Footer>
              <TodoCounter value={activeTodosCount} />

              <TodoFilter
                value={filterValue}
                onValueChange={setFilterValue}
              />

              <ClearCompletedButton
                active={hasCompletedTodos}
                onClear={handleClearCompletedTodos}
              />
            </Footer>
          </>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onHide={clearErrorMessage}
      />
    </div>
  );
};
