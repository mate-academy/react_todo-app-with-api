/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  addTodos,
  deleteTodos,
  editTodos,
  getTodos,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoItem } from './components/TodoItem';
import { Errors } from './types/Errors';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { UserWarning } from './UserWarning';

const USER_ID = 6398;

const filterTodos = (todos:Todo[], selectedStatus: TodoStatus) => (
  todos.filter(todo => {
    switch (selectedStatus) {
      case TodoStatus.Active:
        return !todo.completed;

      case TodoStatus.Completed:
        return todo.completed;

      case TodoStatus.All:
      default:
        return true;
    }
  })
);

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(TodoStatus.All);
  const [errorType, setErrorType] = useState(Errors.None);
  const [hasErrorNotification, setHasErrorNotification] = useState(false);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const hideErrorNotifications = () => setHasErrorNotification(false);
  const showErrorNotification = (error:Errors) => {
    setErrorType(error);
    setHasErrorNotification(true);
    setTimeout(hideErrorNotifications, 3000);
  };

  const fetchAllTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      showErrorNotification(Errors.Get);
    }
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  const addNewTodo = useCallback(async (title: string) => {
    if (title.trim()) {
      try {
        const newTodo = {
          title,
          userId: USER_ID,
          completed: false,
        };

        setTempTodo({ ...newTodo, id: 0 });

        await addTodos(newTodo);
        await fetchAllTodos();
      } catch {
        showErrorNotification(Errors.Add);
      } finally {
        setTempTodo(null);
      }
    } else {
      showErrorNotification(Errors.EmptyTitle);
    }
  }, []);

  const deleteTodoFromServer = useCallback(async (todoId:number) => {
    try {
      await deleteTodos(todoId);
      await fetchAllTodos();
    } catch {
      showErrorNotification(Errors.Delete);
    }
  }, []);

  const updateTodo = useCallback(async (
    todo: Todo,
    key:keyof Todo,
    value: string | boolean,
  ) => {
    const editedTodo = {
      ...todo,
      [key]: value,
    };

    setUpdatingTodoIds((currentIds) => [...currentIds, todo.id]);

    try {
      await editTodos(todo.id, editedTodo);
      await fetchAllTodos();
      setUpdatingTodoIds([]);
    } catch (error) {
      showErrorNotification(Errors.Edit);
    }
  }, []);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, selectedStatus);
  }, [todos, selectedStatus]);

  const clearCompleted = useCallback(() => {
    const completedTodos = visibleTodos.filter(todo => todo.completed);

    completedTodos.forEach(({ id }) => deleteTodoFromServer(id));
  }, []);

  const activeTodosCount = useMemo(() => {
    return visibleTodos.filter(todo => !todo.completed).length;
  }, [visibleTodos]);

  const complitedTodosCount = useMemo(() => {
    return visibleTodos.filter(todo => todo.completed).length;
  }, [visibleTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addNewTodo={addNewTodo}
          updateTodo={updateTodo}
          activeTodosCount={activeTodosCount}
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
        />

        <section className="todoapp__main">
          <TransitionGroup>

            {visibleTodos.map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  deleteTodo={deleteTodoFromServer}
                  updateTodo={updateTodo}
                  updatingTodoIds={updatingTodoIds}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </section>

        {todos.length > 0
          && (
            <Footer
              selectStatus={setSelectedStatus}
              selectedStatus={selectedStatus}
              activeTodosCount={activeTodosCount}
              complitedTodosCount={complitedTodosCount}
              clearCompleted={clearCompleted}
            />
          )}

      </div>

      <Notification
        notificationMessage={errorType}
        hasErrorNotification={hasErrorNotification}
        hideErrorNotifications={hideErrorNotifications}
      />
    </div>
  );
};
