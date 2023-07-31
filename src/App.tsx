/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Form } from './components/Form';
import { Footer } from './components/Footer';
import { Notifications } from './components/Notifications';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import * as TodoFilter from './utils/TodoFilter';
import { FilterType } from './types/FilterType';
import { NOTIFICATION } from './types/Notification';
import { USER_ID } from './constants/USER_ID';
import { findTodoById } from './utils/FindPostById';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [notification, setNotification] = useState(NOTIFICATION.CLEAR);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [listOfTodoId, setListOfTodoId] = useState<number[]>([]);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);
  const [titleFocus, setTitleFocus] = useState(true);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
        setTempTodo(null);
      }).catch(() => setNotification(NOTIFICATION.LOAD));
  }, []);

  useEffect(() => {
    setListOfTodoId([]);
    setUpdatingTodos([]);
  }, [todos]);

  const addTodo = useCallback((newTodo: Todo) => {
    if (!newTodo.title.trim()) {
      setNotification(NOTIFICATION.ADD);

      throw new Error();
    }

    setLoading(true);
    setTempTodo(newTodo);

    todoService.createTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch((error) => {
        setNotification(NOTIFICATION.ADD);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
        setTitleFocus(!titleFocus);
      });
  }, [todos]);

  const deleteTodo = useCallback((todoId: number) => {
    setLoading(true);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos: Todo[]) => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch((error) => {
        setNotification(NOTIFICATION.DELETE);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setListOfTodoId([]);
      });
  }, [todos]);

  const deleteCompletedTodo = useCallback(() => {
    setLoading(true);

    const completedTodosList = TodoFilter.completedTodos(todos);

    const completedTodoId = completedTodosList.map((todo) => todo.id);

    setListOfTodoId(completedTodoId);

    if (!completedTodosList || completedTodosList.length === 0) {
      setNotification(NOTIFICATION.NO_COMPLETED);
      setLoading(false);

      return;
    }

    completedTodosList.map(todo => deleteTodo(todo.id));
  }, [todos]);

  const changeTodoCompleted = useCallback((todoId: number) => {
    setLoading(true);

    const todoForUpdate = findTodoById(todos, todoId);

    if (todoForUpdate !== null) {
      todoForUpdate.completed = !todoForUpdate.completed;

      todoService.updateTodo(todoForUpdate)
        .then(todo => {
          setTodos(currentTodos => {
            const newTodos = [...currentTodos];
            const index = newTodos.findIndex(newTodo => {
              return newTodo.id === todoForUpdate.id;
            });

            newTodos.splice(index, 1, todo);

            return newTodos;
          });
        })
        .catch((error) => {
          setNotification(NOTIFICATION.UPDATE);
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [todos]);

  const reverteCompletedTodo = useCallback((todosForRevert: Todo[]) => {
    const todosForUpdate = todosForRevert;
    const uncompletedTodosForUpdate = TodoFilter
      .uncompletedTodos(todosForRevert);

    const todosForUpdateId = uncompletedTodosForUpdate.length !== 0
      ? uncompletedTodosForUpdate.map(todo => todo.id)
      : todosForUpdate.map(todo => todo.id);

    setUpdatingTodos(todosForUpdateId);

    if (uncompletedTodosForUpdate.length !== 0) {
      uncompletedTodosForUpdate.map(todo => changeTodoCompleted(todo.id));
    } else {
      todosForUpdate.map(todo => changeTodoCompleted(todo.id));
    }
  }, [todos]);

  const updateTodo = useCallback((todoId: number | null, title: string) => {
    const todoForUpdate = findTodoById(todos, todoId);

    setLoading(true);

    if (todoForUpdate !== null) {
      todoForUpdate.title = title;

      todoService.updateTodo(todoForUpdate)
        .then(todo => {
          setTodos(currentTodos => {
            const newTodos = [...currentTodos];
            const index = newTodos.findIndex(newTodo => {
              return newTodo.id === todoForUpdate.id;
            });

            newTodos.splice(index, 1, todo);

            return newTodos;
          });
        })
        .catch((error) => {
          setNotification(NOTIFICATION.UPDATE);
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [todos]);

  const filteredTodos: Todo[] = useMemo(() => {
    return TodoFilter.getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <Form
            loading={loading}
            todos={todos}
            addTodo={(newTodo) => addTodo(newTodo)}
            reverteCompletedTodo={
              (todosForRevert) => reverteCompletedTodo(todosForRevert)
            }
            titleFocus={titleFocus}
          />
        </header>

        <TodoList
          listOfTodoId={listOfTodoId}
          loading={loading}
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          updateTodo={(todo, title) => updateTodo(todo, title)}
          onChange={(todoId) => changeTodoCompleted(todoId)}
          updatingTodos={updatingTodos}
        />

        {todos.length !== 0
          && (
            <Footer
              todos={todos}
              filterType={filterType}
              setFilterType={setFilterType}
              removeCompleted={deleteCompletedTodo}
            />
          )}
      </div>

      {notification !== NOTIFICATION.CLEAR
        && (
          <Notifications
            notification={notification}
          />
        )}
    </div>
  );
};
