/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect, useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { USER_ID } from './utils/fetchClient';
import { Status } from './types/Status';
import { Message } from './types/Message';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosStatus, setTodosStatus] = useState<Status>(Status.All);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Message | ''>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [titleTodo, setTitleTodo] = useState('');
  const [deletedTodo, setDeletedTodo] = useState<number[]>([]);
  const [changedTodo, setChangedTodo] = useState<number[]>([]);

  const filterTodos = (listTodos: Todo[], status: Status) => {
    switch (status) {
      case Status.Active:
        return listTodos.filter(todo => !todo.completed);
      case Status.Completed:
        return listTodos.filter(todo => todo.completed);
      case Status.All:
      default:
        return listTodos;
    }
  };

  const addTodo = useCallback((({ userId, title, completed }: Todo) => {
    setErrorMessage('');
    setIsLoading(true);

    const createdTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(createdTodo);

    todoService.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitleTodo('');
      })
      .catch(() => {
        setErrorMessage(Message.NoAddTodo);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }), []);

  const removeCompletedTodos = useCallback(((todosId: number[]) => {
    setIsLoading(true);
    setDeletedTodo(todosId);

    todosId.map(todoId => {
      return todoService.deleteTodos(todoId)
        .then(() => {
          setTodos(currentTodos => (
            currentTodos.filter(todo => todo.id !== todoId)
          ));
        })
        .catch((error) => {
          setDeletedTodo([]);
          setErrorMessage(Message.NoDeleteTodo);
          throw error;
        })
        .finally(() => {
          setDeletedTodo([]);
          setIsLoading(false);
        });
    });
  }), []);

  const updateTodoStatus = useCallback(((updatedTodo: Todo) => {
    setErrorMessage('');
    setIsLoading(true);
    setChangedTodo([updatedTodo.id]);

    return todoService.updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos => currentTodos.map(todo => (
          todo.id === updatedTodo.id
            ? {
              ...todo,
              completed: updatedTodo.completed,

            }
            : todo
        )));
      })
      .catch(() => setErrorMessage(Message.NoUpdateTodo))
      .finally(() => {
        setIsLoading(false);
        setChangedTodo([]);
      });
  }), []);

  const updateTodo = async (todo: Todo) => {
    try {
      const newTodo = await todoService.updateTodo(todo);

      return newTodo;
    } catch (error) {
      setErrorMessage(Message.NoUpdateTodo);

      return todo;
    }
  };

  const updateTodosAllStatus = useCallback(((updatedTodos: Todo[]) => {
    setErrorMessage('');
    setIsLoading(true);
    const changedTodoIds = updatedTodos.map(todo => todo.id);

    setChangedTodo(changedTodoIds);

    Promise.all(updatedTodos.map(updatedTodo => updateTodo(updatedTodo)))
      .then((gettedTodos) => {
        const gettedTodosId = gettedTodos.map(todo => todo.id);

        setTodos(currentTodos => currentTodos.map(
          todo => (
            gettedTodosId.includes(todo.id)
              ? { ...todo, completed: gettedTodos[0].completed }
              : todo
          ),
        ));
      })
      .finally(() => {
        setIsLoading(false);
        setChangedTodo([]);
      });
  }), []);

  const updateTitleTodo = useCallback(((updatedTodo: Todo) => {
    setErrorMessage('');
    setChangedTodo([updatedTodo.id]);

    setTodos(currentTodos => currentTodos.map(todo => (
      todo.id === updatedTodo.id
        ? {
          ...todo,
          title: updatedTodo.title,
        }
        : todo
    )));

    return todoService.updateTodo(updatedTodo)
      .catch((error) => {
        setErrorMessage(Message.NoUpdateTodo);
        throw error;
      })
      .finally(() => {
        setChangedTodo([]);
      });
  }), []);

  const removeTodoTitle = useCallback(((todoId: number) => {
    setDeletedTodo([todoId]);

    return todoService.deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos => (
          currentTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(Message.NoDeleteTodo);
        throw error;
      })
      .finally(() => {
        setDeletedTodo([]);
      });
  }), [todos]);

  const visibleTodos = useMemo(() => filterTodos(todos, todosStatus),
    [todos, todosStatus]);
  const activeTodos = useMemo(() => todos.filter(todo => !todo.completed),
    [todos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Message.NoLoadTotos));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTitleTodo={setTitleTodo}
          titleTodo={titleTodo}
          setErrorMessage={setErrorMessage}
          onAddTodo={addTodo}
          isLoading={isLoading}
          setTodos={setTodos}
          todos={todos}
          updateTodosAllStatus={updateTodosAllStatus}
        />

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            removeCompletedTodos={removeCompletedTodos}
            removeTodoTitle={removeTodoTitle}
            deletedTodo={deletedTodo}
            updateTodoStatus={updateTodoStatus}
            changedTodo={changedTodo}
            updateTitleTodo={updateTitleTodo}
          />
        )}
        {tempTodo && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>
            <>
              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>
            </>
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': tempTodo.id === 0,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
        {(todos.length > 0 || tempTodo) && (
          <Footer
            todosStatus={todosStatus}
            setTodosStatus={setTodosStatus}
            todos={filterTodos(todos, todosStatus)}
            activeTodos={activeTodos}
            removeTodo={removeCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
