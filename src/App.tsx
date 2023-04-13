import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  deleteTodo,
  getTodos,
  updateTodoID,
  updateTodoTitle,
} from './api/todos';
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
  const [deletedTodos, setDeletedTodos] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeInput, setActiveInput] = useState(true);

  const visibleTodos = useMemo(() => {
    return filterTodos(todoList, filteredBy);
  }, [todoList, filteredBy]);

  const handleChangeFilterBy = (value: string) => {
    setFilteredBy(value);
  };

  const handleChangeStatus = useCallback(
    async (todoID: number) => {
      try {
        const foundTodo = todoList.find((todo) => todo.id === todoID);

        setDeletedTodos((prevIDs) => [...prevIDs, todoID]);
        await updateTodoID(todoID, !foundTodo?.completed);

        const newTodos = todoList.map((todo) => {
          if (foundTodo?.id === todo.id) {
            foundTodo.completed = !foundTodo.completed;

            return foundTodo;
          }

          return todo;
        });

        setTodoList(newTodos);
      } catch {
        setErrorMessage('Unable to update a todo');
      } finally {
        setDeletedTodos([]);
      }
    },
    [todoList],
  );

  const handleUpdateTitleTodo = useCallback(
    async (todoID: number, todoNewTitle: string) => {
      if (!todoNewTitle) {
        try {
          setDeletedTodos([todoID]);
          const newTodos = todoList.filter((todo) => todo.id !== todoID);

          await deleteTodo(`/todos/${todoID}`);

          setTodoList(newTodos);
        } catch {
          setErrorMessage('Unable to delete a todo');
        } finally {
          setDeletedTodos([]);
        }
      } else {
        try {
          const foundTodo = todoList.find((todo) => todo.id === todoID);

          await updateTodoTitle(todoID, todoNewTitle);

          const newTodos = todoList.map((todo) => {
            if (foundTodo?.id === todo.id) {
              foundTodo.title = todoNewTitle;

              return foundTodo;
            }

            return todo;
          });

          setTodoList(newTodos);
        } catch {
          setErrorMessage('Unable to update a todo');
        }
      }
    },
    [todoList],
  );

  const handleChangeTitleTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { value },
    } = event;

    setTitleTodo(value);
  };

  const fetchTodos = async () => {
    try {
      const todos = await getTodos(USER_ID);

      setTodoList(todos);
    } catch {
      setErrorMessage('Unable to add a todo');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

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
        />

        <TodoList
          todos={visibleTodos}
          setTodoList={setTodoList}
          setErrorMessage={setErrorMessage}
          deletedTodos={deletedTodos}
          setDeletedTodos={setDeletedTodos}
          tempTodo={tempTodo}
          onChangeStatusTodo={handleChangeStatus}
          onChangeNewTitle={handleUpdateTitleTodo}
        />

        {todoList.length > 0 && (
          <Footer
            setTodoList={setTodoList}
            filteredBy={filteredBy}
            todosLengh={visibleTodos.length}
            handleChangeFilterType={handleChangeFilterBy}
            todos={visibleTodos}
            setErrorMessage={setErrorMessage}
            setDeletedTodos={setDeletedTodos}
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
