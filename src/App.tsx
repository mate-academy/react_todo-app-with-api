/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodoCompleted,
} from './api/todos';
import { NewTodo } from './components/NewTodo';
import { ErrorNotification } from './components/ErrorNotifications';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { Notifications } from './types/Notifications';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [notification, setNotification]
   = useState<Notifications>(Notifications.None);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTodosIds, setActiveTodosIds] = useState<number[]>([]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [title]);

  const fetchTodos = async () => {
    if (user) {
      try {
        setTodos(await getTodos(user.id));
      } catch (error) {
        setNotification(Notifications.Load);

        setTimeout(() => {
          setNotification(Notifications.None);
        }, 3000);
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [todos]);

  const filterTodos = (filterType: Filter) => {
    switch (filterType) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      case Filter.All:
      default:
        return todos;
    }
  };

  const addNewTodo = async (newTitle: string) => {
    if (user) {
      const newId = todos.length;

      setActiveTodosIds(todosIds => [...todosIds, newId]);

      try {
        setIsAdding(true);

        const newTodo = await addTodo({
          title: newTitle,
          userId: user.id,
          completed: false,
        });

        setIsAdding(false);
        setTodos(visibleTodos => [...visibleTodos, newTodo]);
      } catch (error) {
        setNotification(Notifications.Add);
        setTitle('');
        setIsAdding(false);

        setTimeout(() => {
          setNotification(Notifications.None);
        }, 3000);
      }

      setActiveTodosIds(todosIds => todosIds.filter(
        todosId => todosId === newId,
      ));
    }
  };

  const removeTodo = async (id: number) => {
    setActiveTodosIds(todosIds => [...todosIds, id]);

    try {
      await deleteTodo(id);
    } catch (error) {
      setNotification(Notifications.Delete);

      setTimeout(() => {
        setNotification(Notifications.None);
      }, 3000);
    }

    setActiveTodosIds(todosIds => todosIds.filter(todosId => todosId === id));
  };

  const completedTodos = filterTodos(Filter.Completed);

  const deleteCompletedTodos = async () => {
    setActiveTodosIds(completedTodos.map(todo => todo.id));

    try {
      await Promise.all(completedTodos.map(async todo => {
        await deleteTodo(todo.id);
      }));
    } catch (error) {
      setNotification(Notifications.Delete);

      setTimeout(() => {
        setNotification(Notifications.None);
      }, 3000);
    }

    setActiveTodosIds([]);
  };

  const togleStatus = async (
    id: number,
    completed: boolean,
    isLoading: (value: boolean) => void,
  ) => {
    setActiveTodosIds(todosIds => [...todosIds, id]);

    try {
      isLoading(true);
      await updateTodoCompleted(id, !completed);
    } catch (error) {
      setNotification(Notifications.Update);
      isLoading(false);

      setTimeout(() => {
        setNotification(Notifications.None);
      }, 3000);
    }

    isLoading(false);
    setActiveTodosIds(todosIds => todosIds.filter(todosId => todosId !== id));
  };

  const activeTodos = filterTodos(Filter.Active);

  const toggleAllTodos = async () => {
    const activeIds = activeTodos.map(todo => todo.id);
    const allIds = todos.map(todo => todo.id);

    try {
      setActiveTodosIds(todosIds => [...todosIds, ...activeIds]);
      await Promise.all(activeTodos
        .map(todo => updateTodoCompleted(todo.id, true)));
      setActiveTodosIds([]);

      if (completedTodos.length === todos.length) {
        setActiveTodosIds(todosIds => [...todosIds, ...allIds]);
        await Promise.all(todos
          .map(todo => updateTodoCompleted(todo.id, !todo.completed)));
        setActiveTodosIds([]);
      }
    } catch {
      setNotification(Notifications.Update);
      setActiveTodosIds([]);

      setTimeout(() => {
        setNotification(Notifications.None);
      }, 3000);
    }
  };

  const filteredTodos = filterTodos(filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!filteredTodos.length && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: completedTodos.length === todos.length },
              )}
              onClick={toggleAllTodos}
            />
          )}
          <NewTodo
            newTodoField={newTodoField}
            title={title}
            setTitle={setTitle}
            addNewTodo={addNewTodo}
            isAdding={isAdding}
            setNotification={setNotification}
          />
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              setNotification={setNotification}
              isAdding={isAdding}
              title={title}
              removeTodo={removeTodo}
              togleStatus={togleStatus}
              activeTodosIds={activeTodosIds}
            />
            <Footer
              filter={filter}
              setFilter={setFilter}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>
      {notification && (
        <ErrorNotification
          notification={notification}
          resetNotification={() => setNotification(Notifications.None)}
        />
      )}
    </div>
  );
};
