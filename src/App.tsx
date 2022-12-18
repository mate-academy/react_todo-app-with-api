import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addTodo,
  editTodo,
  getTodos,
  removeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Errors } from './components/Errors';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/Errors';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [currError, setCurrError] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoadingTodosIds, setIsLoadingTodosIds] = useState<number[]>([]);

  const getTodosFromServer = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(user?.id || 1);

      setTodos(todosFromServer);
    } catch (_) {
      setHasError(true);
      setCurrError('Something went wrong :(. We can not load user`s todos');
    }
  }, []);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setCurrError(ErrorMessage.None);

      if (title.trim() && user) {
        setIsAdding(true);

        try {
          await addTodo({
            userId: user.id,
            title: title.trim(),
            completed: false,
          });

          await getTodosFromServer();
          setTitle('');
        } catch {
          setCurrError(ErrorMessage.Add);
        } finally {
          setIsAdding(false);
        }
      } else {
        setCurrError(ErrorMessage.Title);
      }
    }, [title, user],
  );

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleDelete = useCallback(
    async (todoId: number) => {
      setCurrError(ErrorMessage.None);
      setIsLoadingTodosIds(prevIds => [...prevIds, todoId]);

      try {
        await removeTodo(todoId);

        await getTodosFromServer();
      } catch {
        setCurrError(ErrorMessage.Delete);
      } finally {
        setIsLoadingTodosIds([]);
      }
    }, [],
  );

  const handleClearCompleted = useCallback(
    async () => {
      setCurrError(ErrorMessage.None);
      setIsLoadingTodosIds(prevTodoIds => ([
        ...prevTodoIds,
        ...completedTodos.map(todo => todo.id),
      ]));

      try {
        await Promise.all(completedTodos.map(todo => (
          removeTodo(todo.id)
        )));

        await getTodosFromServer();
      } catch {
        setCurrError(ErrorMessage.Delete);
      }
    }, [completedTodos],
  );

  const handleChangeStatus = useCallback(
    async (todo: Todo) => {
      const { completed, id } = todo;

      setCurrError(ErrorMessage.None);
      setIsLoadingTodosIds(prevIds => [...prevIds, id]);

      try {
        await editTodo(id, {
          completed: !completed,
        });

        await getTodosFromServer();
      } catch {
        setCurrError(ErrorMessage.Update);
      } finally {
        setIsLoadingTodosIds([]);
      }
    }, [],
  );

  const loadUserTodos = useCallback(async () => {
    if (!user) {
      return;
    }

    setCurrError(ErrorMessage.None);

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    } catch {
      setCurrError(ErrorMessage.NoTodos);
    }
  }, [user]);

  useEffect(() => {
    loadUserTodos();
  }, [user]);

  const handleRename = async (todo: Todo, newTitle: string) => {
    const { title: curTitle, id } = todo;

    if (!newTitle) {
      handleDelete(id);

      return;
    }

    if (newTitle !== curTitle) {
      setCurrError(ErrorMessage.None);
      setIsLoadingTodosIds(prevIds => [...prevIds, id]);

      try {
        await editTodo(id, { title: newTitle });

        await loadUserTodos();
      } catch {
        setCurrError(ErrorMessage.Update);
      } finally {
        setIsLoadingTodosIds([]);
      }
    }
  };

  const showedTodos = useMemo(() => (
    todos.filter(todo => {
      switch (status) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        case Status.All:
        default:
          return true;
      }
    })
  ), [status, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={handleSubmit}
          title={title}
          onTitleChange={setTitle}
          isAdding={isAdding}
        />
        <TodoList
          todos={showedTodos}
          status={status}
          curTitle={title}
          onDelete={handleDelete}
          isAdding={isAdding}
          loadingTodosIds={isLoadingTodosIds}
          onRename={handleRename}
          onChangeStatus={handleChangeStatus}
        />
        <Footer
          status={status}
          onChangeStatus={setStatus}
          activeTodos={activeTodos}
          onClear={handleClearCompleted}
          completedTodos={completedTodos}
        />
      </div>

      <Errors
        currError={currError}
        setCurrError={setCurrError}
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
