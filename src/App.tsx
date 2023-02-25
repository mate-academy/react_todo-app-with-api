/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
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

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(TodoStatus.All);
  const [errorType, setErrorType] = useState(Errors.None);
  const [hasErrorNotification, setHasErrorNotification] = useState(false);
  const [isUpdatingIds, setIsUpdatingIds] = useState<number[]>([]);

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

  const addNewTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      await addTodos(newTodo);
      await fetchAllTodos();
    } catch {
      showErrorNotification(Errors.Add);
    }
  };

  const deleteTodoFromServer = async (todoId:number) => {
    try {
      await deleteTodos(todoId);
      await fetchAllTodos();
    } catch {
      showErrorNotification(Errors.Delete);
    }
  };

  const updateTodo = async (
    todo: Todo,
    key:keyof Todo,
    value: string | boolean,
  ) => {
    const editedTodo = {
      ...todo,
      [key]: value,
    };

    setIsUpdatingIds((currentIds) => [...currentIds, todo.id]);

    try {
      await editTodos(todo.id, editedTodo);
      await fetchAllTodos();
      // setIsLoaded(true);
      setIsUpdatingIds([]);
    } catch (error) {
      showErrorNotification(Errors.Edit);
    }
  };

  let visibleTodos = [...todos];

  if (selectedStatus === TodoStatus.Active) {
    visibleTodos = todos.filter(todo => !todo.completed);
  }

  if (selectedStatus === TodoStatus.Completed) {
    visibleTodos = todos.filter(todo => todo.completed);
  }

  const clearCompleted = () => {
    const completedTodos = visibleTodos.filter(todo => todo.completed);

    completedTodos.forEach(({ id }) => deleteTodoFromServer(id));
  };

  const activeTodosCount = visibleTodos.filter(todo => !todo.completed).length;

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
                  isUpdatingIds={isUpdatingIds}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </section>

        {visibleTodos.length > 0
          && (
            <Footer
              selectStatus={setSelectedStatus}
              selectedStatus={selectedStatus}
              activeTodosCount={activeTodosCount}
              clearCompleted={clearCompleted}
            />
          )}

      </div>

      {/* Add the 'hidden' class to hide the message smoothly */}
      {hasErrorNotification
        && (
          <Notification
            notificationMessage={errorType}
            hideErrorNotifications={hideErrorNotifications}
          />
        )}
    </div>
  );
};
