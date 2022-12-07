/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Errors } from './types/Errors';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  removeTodo,
  updateTodo,
} from './api/todos';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NONE);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosFiltered, setTodosFiltered] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTodoID, setActiveTodoID] = useState<number[]>([]);

  const closeError = () => setIsError(false);

  const showError = (message: Errors) => {
    setIsError(true);
    setErrorMessage(message);
    setTimeout(closeError, 3000);
  };

  const loadTodos = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (e) {
      showError(Errors.UNEXPECTED);
    }
  }, []);

  const addNewTodo = async (title: string) => {
    try {
      if (user) {
        const newTodo: Todo = {
          id: todos.length,
          userId: user.id,
          completed: false,
          title,
        };

        setActiveTodoID(currentTodoIds => [...currentTodoIds, newTodo.id]);
        await addTodo(newTodo);
        await loadTodos();
        await setIsAdding(true);
        setActiveTodoID([]);
      }
    } catch (e) {
      showError(Errors.ADD);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setActiveTodoID(currentTodoIds => [...currentTodoIds, todoId]);
      await removeTodo(todoId);
      await loadTodos();
      setActiveTodoID([]);
    } catch (e) {
      showError(Errors.DELETE);
    }
  };

  const clearTodo = async () => {
    try {
      const completedTodos: Todo[] = await todos.filter(todo => todo.completed);

      await completedTodos.map(async (todo: Todo) => {
        setActiveTodoID(currentTodoIds => [...currentTodoIds, todo.id]);
        await deleteTodo(todo.id);
        await loadTodos();
        setActiveTodoID([]);
      });
    } catch (e) {
      showError(Errors.DELETE);
    }
  };

  const changeTodo = async (
    todo: Todo,
    title: string,
    completed: boolean,
    toggleAll = false,
  ) => {
    try {
      if (toggleAll) {
        todos.filter((item) => !item.completed)
          .map(item => {
            return setActiveTodoID(currentTodoIds => {
              return [...currentTodoIds, item.id];
            });
          });
      } else {
        setActiveTodoID(currentTodoIds => [...currentTodoIds, todo.id]);
      }

      await updateTodo({
        ...todo,
        title,
        completed,
      });
      await loadTodos();
      setActiveTodoID([]);
    } catch (e) {
      showError(Errors.UPDATE);
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  useEffect(() => {
    const todosVisable = todos.filter(todo => {
      switch (filterBy) {
        case Filter.ACTIVE:
          return !todo.completed;

        case Filter.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });

    setTodosFiltered(todosVisable);
  }, [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isAdding={isAdding}
          addNewTodo={addNewTodo}
          showError={showError}
          todos={todos}
          changeTodo={changeTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todosFiltered}
              isAdding={isAdding}
              onDelete={deleteTodo}
              activeTodoID={activeTodoID}
              changeTodo={changeTodo}
              showError={showError}
            />
            <Footer
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              onDelete={clearTodo}
            />
          </>
        )}

        {isError && (
          <ErrorNotification
            isError={isError}
            error={errorMessage}
            onClose={closeError}
          />
        )}

      </div>
    </div>
  );
};
