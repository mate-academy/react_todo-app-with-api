/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import {
  createTodo,
  getTodos,
  removeTodo,
  patchTodo,
} from './api/todos';
import { NewTodoData, Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { FilterType } from './enum/FilterType';
import { USER_ID } from './utils/fetchClient';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoStatus, setTodoStatus] = useState<FilterType>(FilterType.All);
  const [hasErrorMessage, setHasErrorMessage] = useState(false);
  const [isLoadErrorMessage, setIsLoadErrorMessage] = useState(false);
  const [isAddErrorMessage, setIsAddErrorMessage] = useState(false);
  const [isDeleteErrorMessage, setIsDeleteErrorMessage] = useState(false);
  const [isChangeStatusMessage, setIsChangeStatusMessage] = useState(false);
  const [isAllStatusErrorMessage, setIsAllStatusErrorMessage] = useState(false);
  const [title, setTitle] = useState('');

  let timeout: ReturnType<typeof setTimeout>;

  const showError = useCallback(() => {
    setHasErrorMessage(true);
    timeout = setTimeout(() => {
      setHasErrorMessage(false);
    }, 3000);
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      showError();
      setIsLoadErrorMessage(true);
    }
  }, []);

  const addTodo = useCallback(async (newTodoData: NewTodoData) => {
    try {
      const createdTodo = await createTodo(newTodoData);

      setTodos(prevTodo => [...prevTodo, createdTodo]);
    } catch {
      showError();
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      await removeTodo(todoId);

      setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== todoId));
    } catch {
      showError();
      setIsDeleteErrorMessage(true);
    }
  }, [todos]);

  const updateTodo = useCallback(async (
    todoId: number,
    todoData: Todo,
  ) => {
    try {
      await patchTodo(todoId, todoData);

      setTodos(prevTodos => {
        return prevTodos.map((todo) => (
          todo.id === todoId ? todoData : todo
        ));
      });
    } catch {
      showError();
      setIsChangeStatusMessage(true);
    }
  }, []);

  const updateAllTodosStatus = useCallback(async () => {
    try {
      await Promise.all(todos.map(todo => {
        const updatedTodo = {
          ...todo,
          completed: !todo.completed,
        };

        return patchTodo(todo.id, updatedTodo);
      }));

      setTodos(prevTodos => prevTodos.map((todo) => {
        if (prevTodos.every((status) => status.completed)) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return {
          ...todo,
          completed: true,
        };
      }));
    } catch {
      showError();
      setIsAllStatusErrorMessage(true);
    }
  }, [todos]);

  const handleUpdateStatusAll = () => {
    updateAllTodosStatus();
  };

  const clearAllCompletedTodo = useCallback(async () => {
    try {
      const completedTodo = todos.filter((todo) => todo.completed);

      await Promise.all(completedTodo.map((todo) => removeTodo(todo.id)));

      setTodos(prevTodos => prevTodos.filter((todo) => !todo.completed));
    } catch {
      showError();
    }
  }, [todos]);

  const hanldeClearCompleted = () => {
    clearAllCompletedTodo();
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (todoStatus) {
        case FilterType.Active:
          return !completed;

        case FilterType.Completed:
          return completed;

        case FilterType.All:
        default:
          return todos;
      }
    });
  }, [todos, todoStatus]);

  const handleStatus = useCallback((filter: FilterType) => {
    setTodoStatus(filter);
  }, []);

  useEffect(() => {
    try {
      loadTodos();
    } catch {
      clearTimeout(timeout);
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          onTitleError={setIsAddErrorMessage}
          onError={showError}
          onUpdate={handleUpdateStatusAll}
          todos={todos}
          title={title}
          onSetTitle={setTitle}
        />

        <TodoList
          todos={filteredTodos}
          onDeleteTodo={deleteTodo}
          onUpdate={updateTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            onStatusSelect={handleStatus}
            todoStatus={todoStatus}
            onClear={hanldeClearCompleted}
          />
        )}
      </div>

      {hasErrorMessage && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={() => setHasErrorMessage(false)}
          />
          {isChangeStatusMessage && <p>Unable to change todo status</p>}
          {isLoadErrorMessage && <p>Unable to load data</p>}
          {isAddErrorMessage && <p>Unable to add empty todo</p>}
          {isDeleteErrorMessage && <p>Unable to delete todo</p>}
          {isAllStatusErrorMessage && (
            <p>Unable to update status for all todos</p>
          )}
        </div>
      )}
    </div>
  );
};
