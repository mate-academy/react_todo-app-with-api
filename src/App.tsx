import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import {
  deleteTodo, getTodos, postTodos, updateTodo,
} from './api/todos';
import { ErrorMessages } from './types/ErrorMessages';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { TodoFilter } from './types/TodoFilter';
import { filterTodos } from './utils/filter';
import { ToggleType } from './types/ToggleType';

const USER_ID = 11535;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoFilter, setTodoFilter] = useState<TodoFilter>(TodoFilter.All);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.None);
  const [isClearCompleted, setIsClearCompleted] = useState(false);
  const [toggleType, setToggleType] = useState<ToggleType>(ToggleType.None);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableLoadTodo);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(ErrorMessages.None);
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    const prepTodos = filterTodos(todos, todoFilter);

    setFilteredTodos(prepTodos);
  }, [todos, todoFilter]);

  const handleSetTodoFilter = (filter: TodoFilter) => (
    setTodoFilter(filter)
  );

  const handleAddNewTodo = async (todoTitle: string) => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    try {
      const responseTodo = await postTodos(newTodo);

      setTempTodo(null);
      setTodos(prevTodos => [...prevTodos, responseTodo]);

      return true;
    } catch {
      setTempTodo(null);
      setErrorMessage(ErrorMessages.UnableAddTodo);

      return false;
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos((prevState) => prevState.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessages.UnableDeleteTodo);
    }
  };

  const handleChangeStatus = async (todoId: number, todoStatus: boolean) => {
    const todoToUpdate = todos.find((todo) => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    const newStatus = {
      completed: todoStatus,
    };

    try {
      await updateTodo(todoId, newStatus);

      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              completed: todoStatus,
            };
          }

          return todo;
        });

        return updatedTodos;
      });
    } catch {
      setErrorMessage(ErrorMessages.UnableUpdateTodo);
    }
  };

  const handleChangeTitle = async (todoId: number, todoTitle: string) => {
    const todoToUpdate = todos.find((todo) => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    const newTitle = {
      title: todoTitle,
    };

    try {
      await updateTodo(todoId, newTitle);

      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              title: todoTitle,
            };
          }

          return todo;
        });

        return updatedTodos;
      });
    } catch {
      setErrorMessage(ErrorMessages.UnableUpdateTodo);
    }
  };

  const hideErrors = () => {
    setErrorMessage(ErrorMessages.None);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onSetErrorMessage={setErrorMessage}
          onAddNewTodo={handleAddNewTodo}
          setToggleType={setToggleType}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          isClearCompleted={isClearCompleted}
          toggleType={toggleType}
          onChangeStatus={handleChangeStatus}
          onDeleteTodo={handleDeleteTodo}
          onChangeTitle={handleChangeTitle}
          setIsClearCompleted={setIsClearCompleted}
          setToggleType={setToggleType}
        />

        {!!todos.length && (
          <Footer
            filter={todoFilter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            setFilter={handleSetTodoFilter}
            setIsClearCompleted={setIsClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} hideErrors={hideErrors} />
    </div>
  );
};
