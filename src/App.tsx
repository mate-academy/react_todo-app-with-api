import React, {
  useState,
  useMemo,
  useEffect,
} from 'react';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFilter } from './components/TodoFilter';
import { Notification } from './components/Notification';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { useTodoContext } from './TodoContext';
import * as todoService from './api/todos';
import { TodoStatus } from './types';
import {
  USER_ID,
  ERRORS,
} from './utils/constants';

export const App: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filterByStatus, setFilterByStatus] = useState(TodoStatus.All);

  const {
    todoItems,
    setTodoItems,
    setTempTodo,
    setErrorMessage,
  } = useTodoContext();

  const visibleTodos = useMemo(() => getFilteredTodos(
    filterByStatus, todoItems,
  ), [filterByStatus, todoItems]);

  const addTodo = async (title: string) => {
    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    try {
      const createdTodo = await todoService.createTodo(newTodo);

      setTodoItems(prevTodos => [...prevTodos, createdTodo]);
      setNewTodoTitle('');
    } catch (error) {
      setErrorMessage(ERRORS.POST_ERROR);
    } finally {
      setTempTodo(null);
    }
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodoItems)
      .catch(() => {
        setErrorMessage(ERRORS.DOWNLOAD_ERROR);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          addTodo={addTodo}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
        />

        <TodoList
          todos={visibleTodos}
        />

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
