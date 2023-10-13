import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getpreparedTodos } from './utils/PreparedTodos';
import { TodosFilter } from './types/TodoFilter';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodo,
} from './api/todos';
import { TodoApp } from './components/TodoApp/TodoApp';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TempTodo } from './components/TempTodo/TempTodo';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { USER_ID } from './utils/idConstant';
import { ErrorMessages } from './utils/errorMessage';

export const App: React.FC = () => {
  const [todos, setTodo] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodosFilter>(TodosFilter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<number[]>([]);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [todoTitle, setTitle] = useState('');

  const activeTodosCount = todos
    .filter(({ completed }) => completed === false).length;

  const hasCompletedTodosCount = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    setIsLoading(true);
    getTodos(USER_ID)
      .then(createdTodo => {
        setTodo(createdTodo);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.LoadError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleAddTodos = (newTodo: Omit<Todo, 'id'>) => {
    setLoadingId([0]);
    addTodos(newTodo)
      .then((createdTodo) => {
        setTodo((currentTodo) => [...currentTodo, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.AddError);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        setLoadingId([]);
      });
    const temp: Todo = Object.assign(newTodo, { id: 0 });

    setTempTodo(temp);
  };

  const handleDelete = (todoId: number) => {
    setLoadingId([todoId]);
    setIsLoaderActive(true);
    deleteTodos(todoId)
      .then(() => {
        setTodo(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        setErrorMessage('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DeleteError);
      })
      .finally(() => {
        setLoadingId([]);
        setIsLoading(false);
        setIsLoaderActive(false);
      });
  };

  const handleClearCompleted = () => {
    const isSomeTodosCompleted = todos
      .reduce((total: number[], current) => (current.completed
        ? [...total, current.id]
        : total), []);

    Promise.all(isSomeTodosCompleted)
      .then((responses) => responses.forEach((id) => {
        handleDelete(id);
      }))
      .catch(() => {
        setErrorMessage(ErrorMessages.UpdateError);
        throw new Error(ErrorMessages.UpdateError);
      });
  };

  const handleDeleteUpdate = (todo: Todo, newTodoTitle: string) => {
    updateTodo({
      id: todo.id,
      title: newTodoTitle,
      userId: todo.userId,
      completed: todo.completed,
    })
      .then(updatedTodo => {
        setTodo(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .finally(() => {
        setLoadingId([]);
        setIsLoaderActive(false);
      });
  };

  const handleToggleTodo = (todo: Todo) => {
    setLoadingId((prevTodoId) => [...prevTodoId, todo.id]);

    return updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .then(updatedTodo => {
        setTodo(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.ToggleError);
        throw new Error(ErrorMessages.ToggleError);
      })
      .finally(() => {
        setLoadingId((prevTodoId) => prevTodoId.filter(id => id !== todo.id));
      });
  };

  const isAllCompleted = todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    const todosForUpdate = isAllCompleted ? todos : todos
      .filter(todo => !todo.completed);

    todosForUpdate.forEach(handleToggleTodo);
  };

  const filteredTodos = useMemo((
  ) => getpreparedTodos(todos, filter), [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeTodosCount={activeTodosCount}
          onSubmit={handleAddTodos}
          todo={filteredTodos[0] || null}
          userId={USER_ID}
          isLoading={isLoading}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          title={todoTitle}
          setTitle={setTitle}
          isAllCompleted={isAllCompleted}
          onToggleAll={handleToggleAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.length && (
            filteredTodos.map((todo) => (
              <TodoApp
                todo={todo}
                key={todo.id}
                onDelete={handleDelete}
                loadingId={loadingId}
                isLoaderActive={isLoaderActive}
                setErrorMessage={setErrorMessage}
                onTodoUpdate={(todosTitle) => {
                  handleDeleteUpdate(todo, todosTitle);
                }}
                onTodoToggle={() => handleToggleTodo(todo)}
              />
            ))
          )}
        </section>

        {tempTodo && (
          <TempTodo tempTodo={tempTodo} />
        )}

        {!!todos.length && (
          <TodoFilter
            filter={filter}
            setFilter={setFilter}
            activeTodosCount={activeTodosCount}
            hasCompletedTodosCount={hasCompletedTodosCount}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
