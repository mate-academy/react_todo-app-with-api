import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { Errors } from './utils/enum';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList/TodoList';
import { filterTodos } from './utils/helpers/filterTodos';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';
import { ErrorMessage } from './Components/ErrorMessage/ErrorMessage';
import { USER_ID } from './utils/UserID';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filteredBy, setFilteredBy] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [titleTodo, setTitleTodo] = useState('');
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeInput, setActiveInput] = useState(true);

  const hasActiveTodo = todoList.some((todo) => !todo.completed);

  const visibleTodos = useMemo(() => {
    return filterTodos(todoList, filteredBy);
  }, [todoList, filteredBy]);

  const fetchTodos = async () => {
    try {
      const todos = await getTodos(USER_ID);

      setTodoList(todos);
    } catch {
      setErrorMessage(Errors.Fetch);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleChangeFilterBy = (value: string) => {
    setFilteredBy(value);
  };

  const handleChangeStatus = useCallback(
    async (todoID: number) => {
      try {
        const foundTodo = todoList.find((todo) => todo.id === todoID);

        setLoadingTodos((prevIDs) => [...prevIDs, todoID]);
        await updateTodoStatus(todoID, !foundTodo?.completed);

        const newTodos = todoList.map((todo) => {
          if (foundTodo?.id === todo.id) {
            foundTodo.completed = !foundTodo.completed;

            return foundTodo;
          }

          return todo;
        });

        setTodoList(newTodos);
      } catch {
        setErrorMessage(Errors.UpdateStatus);
      } finally {
        setLoadingTodos([]);
      }
    },
    [todoList],
  );

  const handleUpdateTitleTodo = useCallback(
    async (todoID: number, todoNewTitle: string) => {
      if (!todoNewTitle) {
        try {
          setLoadingTodos([todoID]);
          const newTodos = todoList.filter((todo) => todo.id !== todoID);

          await deleteTodo(todoID);

          setTodoList(newTodos);
        } catch {
          setErrorMessage(Errors.Delete);
        } finally {
          setLoadingTodos([]);
        }
      } else {
        try {
          const updatedTodo = await updateTodoTitle(todoID, todoNewTitle);

          const newTodos = todoList.map((todo) => {
            if (updatedTodo.id === todo.id) {
              return updatedTodo;
            }

            return todo;
          });

          setTodoList(newTodos);
        } catch {
          setErrorMessage(Errors.UpdateTodo);
        }
      }
    },
    [todoList],
  );

  const handleChangeStatusAllTodos = useCallback(async () => {
    const allTodosPromises = todoList.map((todo) => {
      if ((hasActiveTodo && !todo.completed)
        || (!hasActiveTodo && todo.completed)) {
        setLoadingTodos((prev) => [...prev, todo.id]);
      }

      return updateTodoStatus(todo.id, hasActiveTodo);
    });

    try {
      const updatedTodos = await Promise.all(allTodosPromises);

      setTodoList(updatedTodos);
    } catch {
      setErrorMessage(Errors.UpdateStatus);
    } finally {
      setLoadingTodos([]);
    }
  }, [todoList]);

  const handleChangeTitleTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { value },
    } = event;

    setTitleTodo(value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todoList}
          setTodoList={setTodoList}
          title={titleTodo}
          handleChangeTitle={handleChangeTitleTodo}
          setTitleTodo={setTitleTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          activeInput={activeInput}
          setActiveInput={setActiveInput}
          handleChangeStatusAllTodos={handleChangeStatusAllTodos}
        />

        <TodoList
          todos={visibleTodos}
          setTodoList={setTodoList}
          setErrorMessage={setErrorMessage}
          loadingTodos={loadingTodos}
          setLoadingTodos={setLoadingTodos}
          tempTodo={tempTodo}
          onChangeStatusTodo={handleChangeStatus}
          onChangeNewTitle={handleUpdateTitleTodo}
        />

        {todoList.length > 0 && (
          <Footer
            setTodoList={setTodoList}
            filteredBy={filteredBy}
            todosLength={visibleTodos.length}
            handleChangeFilterType={handleChangeFilterBy}
            todos={visibleTodos}
            setErrorMessage={setErrorMessage}
            setLoadingTodos={setLoadingTodos}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
