import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  deleteTodo,
  completedTodo,
  updateTodoTitle,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { FilterBy } from './types/FilterBy';
import { Notification } from './components/Notification';
import { NewTodo } from './types/NewTodo';
import { ErrorNotifications } from './types/ErrorNotifications';
import { getFilteredTodos } from './utils/getFilteredTodos';

const USER_ID = 6259;
let isToggled = false;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(ErrorNotifications.NONE);
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingTodosId, setEditingTodosId] = useState<number[]>([]);
  const [formShowedForId, setFormShowedForId] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const getAllTodos = async () => {
    try {
      setIsLoading(true);
      const data = await getTodos(USER_ID);

      setTodos(data);
      setIsLoading(false);
      setTempTodo(null);
    } catch (error) {
      setErrorText(ErrorNotifications.LOADING);
      setIsError(true);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  const handleAddTodo = async (todoText: string) => {
    if (!todoTitle.trim()) {
      setIsError(true);
      setErrorText(ErrorNotifications.TITLE);
    } else {
      const newTodoBody: NewTodo = {
        title: todoText,
        userId: USER_ID,
        completed: false,
      };

      const tempTodoBody = { ...newTodoBody, id: 0 };

      try {
        setTodoTitle('');
        setTempTodo(tempTodoBody);
        await addTodo(USER_ID, newTodoBody);
        getAllTodos();
      } catch {
        setIsError(true);
        setErrorText(ErrorNotifications.ADD);
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(USER_ID, todoId);
      getAllTodos();
    } catch {
      setIsError(true);
      setErrorText(ErrorNotifications.DELETE);
    }
  };

  const handleCompletedTodo = async (todoId: number, toggle: boolean) => {
    const completed = !toggle;

    setEditingTodosId(cur => [...cur, todoId]);
    try {
      await completedTodo(USER_ID, todoId, { completed });
      getAllTodos();
    } catch {
      setIsError(true);
      setErrorText(ErrorNotifications.UPDATE_STATUS);
    }

    setEditingTodosId(cur => cur.filter(id => id !== todoId));
  };

  const handleDeleteCompleted = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed === true).map(todo => todo.id);

    completedTodosId.forEach(todoId => handleDeleteTodo(todoId));
  };

  const handleUpdateTodoTitle = async (
    todoId: number,
    newTitle: string,
  ) => {
    setEditingTodosId(cur => [...cur, todoId]);
    try {
      setIsLoading(true);
      await updateTodoTitle(USER_ID, todoId, { title: newTitle });
      getAllTodos();
      setIsLoading(false);
    } catch {
      setIsError(true);
      setErrorText(ErrorNotifications.UPDATE);
    }

    setEditingTodosId([]);
  };

  const toggleAll = async () => {
    todos.forEach(todo => handleCompletedTodo(todo.id, isToggled));
    isToggled = !isToggled;
  };

  const hasCompletedTodos = todos.some(todo => todo.completed === true);

  const activeTodosCounter = todos
    .filter(todo => todo.completed === false).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const todoTitleChange = (value: string) => {
    setTodoTitle(value);
  };

  const closeError = () => {
    setIsError(false);
  };

  const showForm = (todoId: number) => {
    setFormShowedForId(todoId);
  };

  const changeFilter = (selectedFilter: FilterBy) => {
    setFilterBy(selectedFilter);
  };

  const hasActiveTodos = todos.some(todo => !todo.completed);

  const filteredTodos = getFilteredTodos(todos, filterBy);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          hasActiveTodos={hasActiveTodos}
          todoTitle={todoTitle}
          todoTitleChange={todoTitleChange}
          handleAddTodo={handleAddTodo}
          isLoading={isLoading}
          toggleAll={toggleAll}
          itemsCounter={filteredTodos.length}
        />

        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          handleComplitedTodo={handleCompletedTodo}
          editingTodosId={editingTodosId}
          formShowedForId={formShowedForId}
          showForm={showForm}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
          tempTodo={tempTodo}
        />

        {todos.length !== 0
        && (
          <Footer
            changeFilter={changeFilter}
            itemsCounter={activeTodosCounter}
            hasCompletedTodos={hasCompletedTodos}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}

      </div>

      <Notification
        isError={isError}
        errorText={errorText}
        closeError={closeError}
      />

    </div>
  );
};
