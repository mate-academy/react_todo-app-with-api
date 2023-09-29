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
import { filterTodos } from './utils';

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
      .finally(() => setTempTodo(null));
  }, []);

  const handleDeleteTodo = useCallback((todo: Todo) => {
    clearErrorMessage();
    startProcessingTodo(todo);

    return todoService.deleteTodo(todo.id)
      .then(() => removeTodoFromState(todo))
      .finally(() => stopProcessingTodo(todo));
  }, []);

  const handleClearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(({ completed }) => completed);

    Promise
      .all(completedTodos.map(handleDeleteTodo))
      .catch(() => setErrorMessage(ErrorMessage.DeleteTodo));
  }, [todos]);

  const handleToggleTodo = useCallback((todo: Todo) => {
    clearErrorMessage();
    startProcessingTodo(todo);

    return todoService.toggleTodo(todo.id, todo.completed)
      .then(replaceTodoInState)
      .finally(() => stopProcessingTodo(todo));
  }, []);

  const handleToggleAllTodos = useCallback(() => {
    const activeTodos = todos.filter(({ completed }) => !completed);
    const todosToToggle = activeTodos.length ? activeTodos : todos;

    Promise
      .all(todosToToggle.map(handleToggleTodo))
      .catch(() => setErrorMessage(ErrorMessage.UpdateTodo));
  }, [todos]);

  const handleEditTodo = useCallback((todo: Todo, title: string) => {
    clearErrorMessage();
    startProcessingTodo(todo);

    return todoService.editTodo(todo.id, title)
      .then(replaceTodoInState)
      .finally(() => stopProcessingTodo(todo));
  }, []);

  const hasTodos = todos.length > 0 || !!tempTodo;
  const hasCompletedTodos = todos.some(({ completed }) => completed);
  const isAllCompleted = todos.every(({ completed }) => completed);
  const activeTodosCount = todos.filter(({ completed }) => !completed).length;
  const totalTodoCount = todos.length;

  const filteredTodos = useMemo(
    () => filterTodos(todos, filterValue),
    [todos, filterValue],
  );

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
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                  onError={setErrorMessage}
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
        onClose={clearErrorMessage}
      />
    </div>
  );
};
