/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
// import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader/Loader';
import { deleteTodo, getTodos, patchTodos, USER_ID } from './api/todos';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/Errors';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(data => {
        setTodos(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setErrorMessage(ErrorMessage.LoadTodo);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const visibleTodos = todos.filter(todo => {
    switch (filterStatus) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const completedTodos = todos.filter(todo => todo.completed);

  const handleDeleteTodo = async (id: number) => {
    setErrorMessage('');
    setDeletingTodoId(id);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setDeletingTodoId(null);
      inputRef.current?.focus();
    }
  };

  const handleDeleteCompletedTodo = async () => {
    setErrorMessage('');
    setIsProcessing(true);

    let hasError = false;

    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);

        setTodos(prev => prev.filter(newTodo => newTodo.id !== todo.id));
      } catch {
        hasError = true;
      }
    }

    if (hasError) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }

    setIsProcessing(false);
  };

  const toggledTodo = async (id: number, completed: boolean) => {
    setErrorMessage('');
    setUpdatingTodoId(id);

    try {
      await patchTodos(id, { completed: !completed });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, completed: !completed } : todo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setUpdatingTodoId(null);
    }
  };

  const toggledAllTodo = async () => {
    setErrorMessage('');
    setIsPosting(true);

    const activeTodos = todos.filter(todo => !todo.completed);

    const todosToUpdate = activeTodos.length > 0 ? activeTodos : todos;

    try {
      const promises = todosToUpdate.map(todo =>
        patchTodos(todo.id, { completed: !todo.completed }),
      );

      await Promise.all(promises);

      setTodos(prev =>
        prev.map(todo =>
          todosToUpdate.some(newTodo => newTodo.id === todo.id)
            ? { ...todo, completed: activeTodos.length > 0 }
            : todo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update todos');
    } finally {
      setIsPosting(false);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          completedTodos={completedTodos}
          setError={setErrorMessage}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          isPosting={isPosting}
          setIsPosting={setIsPosting}
          isProcessing={isProcessing}
          inputRef={inputRef}
          toggledAllTodo={toggledAllTodo}
        />
        {isLoading && <Loader />}
        {(todos.length > 0 || tempTodo) && !isLoading && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
            isPosting={isPosting}
            deletingTodoId={deletingTodoId}
            toggledTodo={toggledTodo}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            updatingTodoId={updatingTodoId}
            setUpdatingTodoId={setUpdatingTodoId}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            completedTodos={completedTodos}
            handleDeleteCompletedTodo={handleDeleteCompletedTodo}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} />
    </div>
  );
};
