/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Todo, TodoData } from './types/Todo';
import * as todosService from './api/todos';
import { NotificationText, SortCondition } from './types/enums';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Header } from './components/Header';
import { USER_ID } from './utils/user';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[] | null>(null);
  const [visibleTodos, setVisibleTodos] = useState<Todo[] | null>(null);
  const [filterBy, setFilterBy] = useState(SortCondition.All);
  const [activeItemsCount, setActiveItemsCount] = useState(0);
  const [completedItemsCount, setCompletedItemsCount] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([]);
  const [isAllItemsAreCompleted, setIsAllItemsAreCompleted] = useState(false);
  const [notificationMessage, setNotificationMessage]
    = useState<NotificationText | null>(null);

  const showNotification = (text: NotificationText) => {
    setNotificationMessage(text);

    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  const addTodoToTheTodoList = (newTodo: Todo) => {
    setActiveItemsCount(current => current + 1);
    setTodosFromServer(currentTodos => {
      return currentTodos ? [...currentTodos, newTodo] : [newTodo];
    });
  };

  const deleteTodoFromTodoList = (todoToDevelte: Todo) => {
    const { id, completed } = todoToDevelte;

    setTodosFromServer(currentTodos => {
      return currentTodos?.filter(todo => todo.id !== id) || null;
    });

    if (completed) {
      setCompletedItemsCount(current => current - 1);
    } else {
      setActiveItemsCount(current => current - 1);
    }
  };

  const deleteTodo = (todo: Todo) => {
    setTodosInProcess(current => [...current, todo.id]);

    todosService.deleteTodo(todo.id)
      .then(() => {
        deleteTodoFromTodoList(todo);
      })
      .catch((error) => {
        showNotification(NotificationText.Delete);
        throw error;
      })
      .finally(() => {
        setTodosInProcess(current => current.filter(id => id !== todo.id));
      });
  };

  const deleteCompletedTodos = () => {
    const completedTodos = todosFromServer?.filter(todo => todo.completed);

    completedTodos?.forEach(todo => deleteTodo(todo));
    setIsAllItemsAreCompleted(false);
  };

  function updateTodoInTheTodoList(updateTodo: Todo) {
    const isAllCompleted = todosFromServer
    && completedItemsCount === todosFromServer?.length - 1;

    setTodosFromServer(currentTodos => {
      if (currentTodos) {
        const newTodos: Todo[] = [...currentTodos];
        const index = newTodos.findIndex(todo => todo.id === updateTodo.id);

        newTodos.splice(index, 1, updateTodo);

        return newTodos;
      }

      return currentTodos;
    });

    if (updateTodo.completed) {
      if (isAllCompleted) {
        setIsAllItemsAreCompleted(true);
      }

      setCompletedItemsCount(current => current + 1);
    } else {
      setActiveItemsCount(current => current + 1);
      setIsAllItemsAreCompleted(false);
    }
  }

  const updateTodo = (todoId: number, data: TodoData) => {
    setTodosInProcess(current => [...current, todoId]);

    todosService.updateTodo(todoId, data)
      .then(updateTodoInTheTodoList)
      .catch((error) => {
        showNotification(NotificationText.Update);
        throw error;
      })
      .finally(() => {
        setTodosInProcess(current => current.filter(id => id !== todoId));
      });
  };

  const toggleAllTodos = () => {
    let itemsToToggle: Todo[] = [];

    if (!todosFromServer) {
      return;
    }

    itemsToToggle = todosFromServer?.filter(todo => (activeItemsCount
      ? !todo.completed : todo.completed));

    setIsAllItemsAreCompleted(current => !current);

    itemsToToggle.forEach(todo => updateTodo(
      todo.id,
      { completed: !todo.completed },
    ));
  };

  function filterTodos(allTodos: Todo[]) {
    let filteredTodos = allTodos;
    const activeTodos = filteredTodos.filter(todo => !todo.completed);
    const completedTodos = filteredTodos.filter(todo => todo.completed);

    if (filterBy === SortCondition.Active) {
      filteredTodos = activeTodos;
    } else if (filterBy === SortCondition.Completed) {
      filteredTodos = completedTodos;
    }

    setCompletedItemsCount(completedTodos.length);
    setActiveItemsCount(activeTodos.length);
    setVisibleTodos(filteredTodos);
  }

  useEffect(() => {
    if (todosFromServer) {
      filterTodos(todosFromServer);
    }
  }, [todosFromServer, filterBy]);

  useEffect(() => {
    setNotificationMessage(null);

    todosService.getTodos()
      .then(setTodosFromServer)
      .catch((error) => {
        showNotification(NotificationText.Get);
        throw error;
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllItemsAreCompleted={isAllItemsAreCompleted}
          showError={showNotification}
          setNewTodo={addTodoToTheTodoList}
          setTempTodo={setTempTodo}
          toggleAll={toggleAllTodos}
        />

        {!!visibleTodos?.length && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            todosInProcess={todosInProcess}
            deleteTodo={deleteTodo}
            changeTodo={updateTodo}
          />
        )}

        {todosFromServer?.length && (
          <Footer
            filterCondition={filterBy}
            visibleItemsCount={activeItemsCount}
            isCompletedTodos={completedItemsCount > 0}
            setFilterCOndition={setFilterBy}
            clearCompleted={deleteCompletedTodos}
          />
        )}
      </div>

      {notificationMessage && (
        <Notification
          text={notificationMessage}
          hideNotification={() => setNotificationMessage(null)}
        />
      )}
    </div>
  );
};
