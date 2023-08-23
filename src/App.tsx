/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { Error } from './types/Error';
import { Status } from './types/Status';

const USER_ID = 11335;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>(Status.All);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(Error.Loading);
      });
  }, []);

  const numberCompletedTodos
  = todos.filter(todo => todo.completed).length;

  const handleClearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(
      completedTodos.map(todo => (
        todoService.deleteTodo(todo.id)
      )),
    )
      .then(() => {
        setTodos(todos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setError(Error.Delete);
      });
  }, [todos]);

  const handleSubmitForm = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsTodoLoading(true);
      if (!todoTitle) {
        setIsTodoLoading(false);
        setError(Error.Title);
        setTempTodo(null);

        return;
      }

      const newTempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      setTempTodo(newTempTodo);

      todoService.createTodo({
        title: todoTitle,
        userId: USER_ID,
        completed: false,
      })
        .then((newTodo) => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
        })
        .catch(() => {
          setError(Error.Add);
        })
        .finally(() => {
          setIsTodoLoading(false);
          setTodoTitle(Error.None);
          setTempTodo(null);
        });
    }, [todoTitle, todos],
  );

  const deleteTodo = (todoId: number) => {
    setLoadingTodoId([todoId]);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(
          todo => todoId !== todo.id,
        ));
      })
      .catch(() => {
        setError(Error.Delete);
      })
      .finally(() => setLoadingTodoId([]));
  };

  const toggleTodoStatus = async (todoId: number, completed: boolean) => {
    try {
      setLoadingTodoId([todoId]);
      await todoService.updateTodoStatus(todoId, completed);

      setTodos(currentTodos => currentTodos.map(
        todo => (todoId === todo.id ? { ...todo, completed } : todo),
      ));
    } catch {
      setError(Error.Update);
    } finally {
      setLoadingTodoId([]);
    }
  };

  const handleToggleTodosAll = async (completed: boolean) => {
    const todosIds = todos
      .filter(todo => todo.completed !== completed)
      .map(todo => todo.id);

    try {
      setLoadingTodoId(todosIds);

      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed,
      }));

      setTodos(updatedTodos);

      await Promise.all(
        todos.map(todo => todoService.updateTodoStatus(todo.id, completed)),
      );
    } catch {
      setError(Error.Update);
    } finally {
      setLoadingTodoId([]);
    }
  };

  const handleEditTodo = async (todoId: number, newTitle: string) => {
    if (!newTitle) {
      setError(Error.Title);

      return;
    }

    try {
      setLoadingTodoId([todoId]);
      const updatedTodo = await todoService.updateTodoTitle(todoId, newTitle);

      setTodos(currentTodos => currentTodos.map(
        todo => (todoId === todo.id ? updatedTodo : todo),
      ));
    } catch {
      setError(Error.Title);
    } finally {
      setLoadingTodoId([]);
    }
  };

  const visibleTodos = useMemo(() => todos.filter((todo) => {
    switch (status) {
      case Status.All:
        return todo;
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      default:
        return true;
    }
  }), [todos, status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todosLength={visibleTodos.length}
          onSubmit={handleSubmitForm}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isTodoLoading={isTodoLoading}
          numberCompletedTodos={numberCompletedTodos}
          onToggleAll={handleToggleTodosAll}
          allTodosCompleted={todos.length === numberCompletedTodos}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={deleteTodo}
              tempTodo={tempTodo}
              loadingTodoId={loadingTodoId}
              onToggleTodoStatus={toggleTodoStatus}
              onChangeTodoTitle={handleEditTodo}
            />

            <Footer
              todos={todos}
              status={status}
              setStatus={setStatus}
              clearCompletedTodos={handleClearCompletedTodos}
            />
          </>
        )}
        {error && (
          <ErrorMessage
            error={error}
            setError={setError}
          />
        )}
      </div>
    </div>
  );
};
