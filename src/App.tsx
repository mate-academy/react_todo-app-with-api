import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Notification } from './components/Notification/Notification';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoContext } from './TodoContext';
import * as todoService from './api/todos';
import { TodoStatus } from './types';
import {
  USER_ID,
  DOWNLOAD_ERROR,
  POST_ERROR,
} from './utils/constants';

export const App: React.FC = () => {
  const [filterByStatus, setFilterByStatus] = useState(TodoStatus.All);

  const {
    todoItems,
    setTodoItems,
    setTempTodo,
    setErrorMessage,
  } = useContext(TodoContext);

  const visibleTodos = useMemo(() => getFilteredTodos(
    filterByStatus, todoItems,
  ), [filterByStatus, todoItems]);

  const addTodo = async (newTodoTitle: string) => {
    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    try {
      const createdTodo = await todoService.createTodo(newTodo);

      setTodoItems(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setErrorMessage(POST_ERROR);
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodoItems)
      .catch(() => {
        setErrorMessage(DOWNLOAD_ERROR);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader addTodo={addTodo} />

        {!!visibleTodos.length && (
          <TodoList
            todos={visibleTodos}
          />
        )}

        {!!todoItems.length && (
          <TodoFilter
            selectStatus={setFilterByStatus}
            status={filterByStatus}
          />
        )}
      </div>

      <Notification />
    </div>
  );
};
