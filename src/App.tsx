import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
import { getFilteredTodos } from './utils/functions';
import { TodoItem } from './components/TodoItem';
import { TodoFilter } from './components/TodoFilter';
import { Header } from './components/Header';
import { ErrorMessage } from './components/ErrorMessage';
import { TempTodo } from './components/TempTodo';
import { Status } from './types/Status';
import { ErrorMessages } from './utils/ErrorMessages';

const USER_ID = 11457;
const initialTodos: Todo[] = [];

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>(initialTodos);
  const [filterBy, setFilterBy] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.NoError);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingId, setLoadingId] = useState<number[]>([]);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const filteredTodos = getFilteredTodos(todoList, filterBy);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(setTodoList)
      .catch(() => {
        setErrorMessage(ErrorMessages.LoadError);
      });
    const timerId = setInterval(() => {
      setErrorMessage(ErrorMessages.NoError);
    }, 3000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const allTodosId = todoList.map(({ id }) => id);

  const completedTodosId = todoList
    .filter(({ completed }) => completed === true)
    .map(({ id }) => id);

  const hasCompletedTodosCount = completedTodosId.length !== 0;

  const activeTodosCount = todoList
    .filter(({ completed }) => completed === false).length;

  const handleDeleteTodo = (todoId: number) => {
    setLoadingId(prevTodoIds => [...prevTodoIds, todoId]);
    setIsLoaderActive(true);

    return postService.deleteTodo(todoId)
      .then(() => {
        setTodoList(currentList => currentList
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DeleteError);
      })
      .finally(() => {
        setLoadingId([]);
        setIsLoaderActive(false);
      });
  };

  const handleClearCompleted = () => {
    completedTodosId
      .forEach((id) => {
        handleDeleteTodo(id);
      });
  };

  const addNewTodo = (todo: Todo) => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    setErrorMessage(ErrorMessages.NoError);
    setLoadingId([0]);
    setIsLoaderActive(true);

    postService.createTodo(todo)
      .then(newTodo => {
        setTodoList(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
        setTimeout(() => {
          setIsLoaderActive(false);
          setLoadingId([]);
        }, 3000);
      })
      .catch(() => {
        setIsLoaderActive(false);
        setLoadingId([0]);
        setErrorMessage(ErrorMessages.AddError);
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingId([]);
        setIsLoaderActive(false);
      });
  };

  const updateTodo = (todoToUpdate: Todo) => {
    return postService.updateTodo(todoToUpdate)
      .then(todo => {
        setTodoList(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(({ id }) => id === todo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UpdateError);
      })
      .finally(() => {
        setLoadingId([]);
        setIsLoaderActive(false);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessages.EmptyTitleError);

      return;
    }

    addNewTodo({
      id: +new Date(),
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
  };

  const handleComplete = (updatedTodo: Todo) => {
    setErrorMessage(ErrorMessages.NoError);
    setLoadingId([updatedTodo.id]);
    setIsLoaderActive(true);

    const foundTodo = { ...updatedTodo };

    foundTodo.completed = !foundTodo.completed;

    updateTodo(foundTodo);
  };

  const handleToggleAll = () => {
    setIsToggled(prev => !prev);
    setIsLoaderActive(true);
    setLoadingId([...allTodosId]);

    todoList.map(todo => {
      const item = { ...todo, completed: !isToggled };

      updateTodo(item);

      return item;
    });
  };

  const handleEditTodo = (updatedTodo: Todo) => {
    setIsLoaderActive(true);
    setLoadingId([updatedTodo.id]);

    return updateTodo(updatedTodo);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          loadingId={loadingId}
          title={title}
          onTitleChange={setTitle}
          isLoaderActive={isLoaderActive}
          handleToggleAll={handleToggleAll}
          activeTodosCount={activeTodosCount}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos && (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                loadingId={loadingId}
                isLoaderActive={isLoaderActive}
                handleComplete={handleComplete}
                handleEditTodo={handleEditTodo}
                handleDeleteTodo={handleDeleteTodo}
              />
            ))
          )}
        </section>

        {tempTodo !== null && (
          <TempTodo tempTodo={tempTodo} />
        )}

        {todoList.length !== 0 && (
          <TodoFilter
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            activeTodosCount={activeTodosCount}
            hasCompletedTodosCount={hasCompletedTodosCount}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onErrorMessageChange={setErrorMessage}
      />
    </div>
  );
};
