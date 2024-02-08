import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import * as api from './api/todos';
import { FilterType } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoItem } from './components/TodoItem';

const USER_ID = 35;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);

  const [todoChangeLoading, setTodoChangeLoading] = useState(false);
  const [toggleAllChangedLoading, setToggleAllChangedLoading] = useState(false);
  const [clearCompletedLoading, setClearCompletedLoading] = useState(false);

  const closeErrorMsg = useCallback(() => {
    setErrorMessage(ErrorMessage.NONE);
  }, []);

  const newError = useCallback((errorMes: ErrorMessage) => {
    setErrorMessage(errorMes);
    setTimeout(() => {
      closeErrorMsg();
    }, 3000);
  }, [closeErrorMsg]);

  useEffect(() => {
    api.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        newError(ErrorMessage.CANNOT_LOAD_TODOS);
      });
  }, [newError]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filter) {
        case FilterType.ACTIVE:
          return !todo.completed;
        case FilterType.COMPLETED:
          return todo.completed;
        case FilterType.ALL:
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const updateTodo = (updatedTodo: Todo) => {
    api.editTodo(updatedTodo)
      .then(() => {
        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id === updatedTodo.id) {
            return {
              ...todo,
              title: updatedTodo.title,
              completed: updatedTodo.completed,
            };
          }

          return todo;
        }));
      })
      .catch(() => {
        newError(ErrorMessage.UNABLE_TO_UPDATE_A_TODO);
      });
  };

  const isAllCompleted = () => {
    return todos.every(todo => todo.completed === true);
  };

  const handleToggleAllChanged = () => {
    const allCompleted = isAllCompleted();

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setToggleAllChangedLoading(true);

    setTimeout(() => {
      Promise.all(updatedTodos.map(todo => updateTodo(todo)))
        .then(() => {
          setTodos(updatedTodos);
        })
        .catch(() => {
          newError(ErrorMessage.UNABLE_TO_UPDATE_A_TODO);
        });

      setToggleAllChangedLoading(false);
    }, 500);
  };

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      newError(ErrorMessage.TITLE_SHOULD_NOT_BE_EMPTY);

      return;
    }

    setTempTodo({
      id: 0, title, userId: USER_ID, completed: false,
    });

    setTodoChangeLoading(true);

    setTimeout(() => {
      api.createTodo({ title, userId: USER_ID, completed: false })
        .then((newTodo) => {
          const typedNewTodo = newTodo as Todo;

          setTodos((currentTodos: Todo[]) => [...currentTodos, typedNewTodo]);
          setTempTodo(null);
        })
        .catch(() => {
          newError(ErrorMessage.UNABLE_TO_ADD_A_TODO);
          setTempTodo(null);
        });

      setTodoChangeLoading(false);
    }, 500);
  };

  const deleteTodos = (todoId: number) => {
    api.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        newError(ErrorMessage.UNABLE_TO_DELETE_A_TODO);
      });
  };

  const removeCompletedTodos = () => {
    setClearCompletedLoading(true);

    setTimeout(() => {
      Promise.all(
        todos
          .filter(todo => todo.completed)
          .map(todo => {
            return deleteTodos(todo.id);
          }),
      )
        .then(() => {
          setTodos(currentTodos => (
            currentTodos.filter(todo => !todo.completed)
          ));
        })
        .catch(() => {
          newError(ErrorMessage.UNABLE_TO_DELETE_A_TODO);
        });

      setClearCompletedLoading(false);
    }, 500);
  };

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          createTodo={addTodo}
          newError={newError}
          todosLength={todos.length}
          isAllCompleted={isAllCompleted}
          handleToggleAllChanged={handleToggleAllChanged}
        />
        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filteredTodos}
            deleteTodo={deleteTodos}
            updateTodo={updateTodo}
            completedLoading={clearCompletedLoading}
            toggleAllChangedLoading={toggleAllChangedLoading}
          />
          {tempTodo && (
            <TodoItem
              key={tempTodo?.id}
              todo={tempTodo}
              deleteTodo={deleteTodos}
              tempLoading={todoChangeLoading}
              updateTodo={updateTodo}
            />
          )}
        </section>

        {/* Скрываем подвал, если нет todo */}
        {!!todos.length && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            itemsLeft={itemsLeft}
            removeCompleted={removeCompletedTodos}
          />
        )}
      </div>

      {/* Уведомление отображается в случае ошибки */}
      {/* Добавляем класс 'hidden', чтобы плавно скрыть сообщение */}
      <Notification errorMessage={errorMessage} close={closeErrorMsg} />
    </div>
  );
};
