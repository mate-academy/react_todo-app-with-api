/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodosList } from './components/TodosList';
import { TodosSelection } from './components/TodosSelection';
import {
  createTodo, getTodos, patchTodo, removeTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodosSelections } from './types/TodosSelections';
import { ErrorHandler } from './types/ErrorHandler';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [hasError, setHasError] = useState<ErrorHandler>(ErrorHandler.None);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterSelector, setFilterSelector]
    = useState<TodosSelections>(TodosSelections.All);
  const [isAdding, setIsAdding] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [todosChangedIds, setTodosChangedIds]
    = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });
  const isTodosAvailable = todos.length > 0;

  const closeErrorField = () => (
    setHasError(ErrorHandler.None)
  );

  const remainCompletedTodos = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  const getTodosFromServer = useCallback(
    async () => {
      try {
        if (user) {
          const todosFromServer = await getTodos(user.id);

          setTodos(todosFromServer);
          setFilteredTodos(todosFromServer);
        }
      } catch (error) {
        setHasError(ErrorHandler.LoadError);
      }
    }, [],
  );

  const addTodoToServer = useCallback(
    async () => {
      try {
        if (!todoTitle.trim()) {
          setHasError(ErrorHandler.EmptyTitle);

          return;
        }

        setIsAdding(true);

        const addingData = {
          title: todoTitle,
          userId: user?.id || 0,
          completed: false,
        };

        setTempTodo((currentTodo) => ({
          ...currentTodo,
          ...addingData,
        }));

        await createTodo(addingData);
        await getTodosFromServer();

        setIsAdding(false);
        setTodoTitle('');
      } catch (error) {
        setIsAdding(false);
        if (error === ErrorHandler.EmptyTitle) {
          setHasError(ErrorHandler.EmptyTitle);
        } else {
          setHasError(ErrorHandler.AddError);
        }
      }
    }, [todoTitle],
  );

  const removeTodoFromServer = useCallback(
    async (todoId: number) => {
      try {
        setTodosChangedIds(prevIds => [...prevIds, todoId]);
        await removeTodo(todoId);
        await getTodosFromServer();
      } catch (error) {
        setHasError(ErrorHandler.DeleteError);
      }
    }, [todos],
  );

  const removeAllCompletedTodos = useCallback(
    () => {
      const completedTodos = todos.filter(todo => todo.completed);

      completedTodos.forEach(todo => removeTodoFromServer(todo.id));
    }, [todos],
  );

  const changeTodoTitle = useCallback(
    async (todoId: number, newTitle: string) => {
      try {
        setTodosChangedIds(currTodoIds => [...currTodoIds, todoId]);

        const changedData = { title: newTitle };

        await patchTodo(todoId, changedData);
        await getTodosFromServer();

        setTodosChangedIds(currTodosIds => currTodosIds.filter(id => (
          todoId !== id
        )));
      } catch (error) {
        setTodosChangedIds(currTodosIds => currTodosIds.filter(id => (
          todoId !== id
        )));
        setHasError(ErrorHandler.PatchError);
      }
    }, [todos],
  );

  const toggleTodo = useCallback(
    async (todoId: number, status: boolean) => {
      try {
        setTodosChangedIds(currTodoIds => [...currTodoIds, todoId]);

        const patchedData = { completed: status };

        await patchTodo(todoId, patchedData);
        await getTodosFromServer();

        setTodosChangedIds(currTodosIds => currTodosIds.filter(id => (
          todoId !== id
        )));
      } catch (error) {
        setTodosChangedIds(currTodosIds => currTodosIds.filter(id => (
          todoId !== id
        )));
        setHasError(ErrorHandler.PatchError);
      }
    }, [todos],
  );

  const toggleAllTodos = useCallback(
    async () => {
      const todosToToggle = remainCompletedTodos !== todos.length
        ? todos.filter(({ completed }) => !completed)
        : todos;

      await Promise.all(todosToToggle
        .map(({ id, completed }) => (toggleTodo(id, !completed)
        )));
    }, [todos],
  );

  useEffect(() => {
    setTimeout(() => setHasError(ErrorHandler.None), 3000);
  }, [hasError]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  useEffect(() => {
    const filteredBySelection = todos.filter(todo => {
      switch (filterSelector) {
        case TodosSelections.Active:
          return !todo.completed;

        case TodosSelections.Completed:
          return todo.completed;

        default:
          return true;
      }
    });

    setFilteredTodos(filteredBySelection);
  }, [todos, filterSelector]);

  const handleTodoTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isTodosAvailable={isTodosAvailable}
          newTodoField={newTodoField}
          todoTitle={todoTitle}
          setTodoTitle={handleTodoTitleInput}
          addTodo={addTodoToServer}
          isAdding={isAdding}
          toggleAll={toggleAllTodos}
        />
        {isTodosAvailable && (
          <>
            <TodosList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isAdding={isAdding}
              onDelete={removeTodoFromServer}
              todosToDelete={todosChangedIds}
              toggleTodo={toggleTodo}
              changeTitle={changeTodoTitle}
              setError={setHasError}
              getTodos={getTodosFromServer}
            />
            <TodosSelection
              setFilterSelector={setFilterSelector}
              remainCompletedTodos={remainCompletedTodos}
              filterSelector={filterSelector}
              todosLength={todos.length}
              deleteAllCompletedTodos={removeAllCompletedTodos}
            />
          </>
        )}
      </div>
      <ErrorNotification
        hasError={hasError}
        hideError={closeErrorField}
      />
    </div>
  );
};
