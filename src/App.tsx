import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Heder/Heder';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import {
  createTodo, deleteTodo, getTodo, updateTodo,
} from './api/todos';
import { FilterTodos } from './enum/FilterTodos';
import { TodoError } from './enum/TodoError/TodoError';

const USER_ID = 12111;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [chooseFilter, setChooseFilter] = useState(FilterTodos.All);
  const [errorMessage, setErrorMesage] = useState<string | null>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoader, setIsLoader] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [arrayLoader, setArrayLoader] = useState<number[] | null>([]);

  useEffect(() => {
    getTodo(USER_ID).then(setTodos)
      .catch(() => setErrorMesage(TodoError.UnableLoad));
  }, []);

  const filterTodos = useMemo(() => todos.filter((todo: Todo) => {
    switch (chooseFilter) {
      case FilterTodos.Active:
        return !todo.completed;

      case FilterTodos.Completed:
        return todo.completed;

      default:
        return todo;
    }
  }), [chooseFilter, todos]);

  const sendTodo = ({ title, completed }: Omit<Todo, 'userId' | 'id'>) => {
    setTempTodo({
      title,
      completed,
      id: 0,
      userId: USER_ID,
    });

    setArrayLoader([0]);
    setIsLoader(true);
    createTodo({
      title, completed, userId: USER_ID,
    })
      .then((todo) => {
        setTodos((currentTodo) => [...currentTodo, todo]);
        setQueryInput('');
      })
      .catch((error) => {
        setErrorMesage(TodoError.UnableAdd);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoader(false);
        setArrayLoader(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setIsLoader(true);
    setArrayLoader([id]);
    deleteTodo(id)
      .then(() => setTodos((currentTodos) => currentTodos
        .filter(todo => todo.id !== id)))
      .catch((error) => {
        setErrorMesage(TodoError.UnableDelete);
        throw error;
      })
      .finally(() => {
        setIsLoader(false);
        setArrayLoader(null);
      });
  };

  const handleUpdateTodo = (todo: Todo) => {
    const { id } = todo;

    setArrayLoader([id]);
    setIsLoader(true);
    updateTodo(todo).then((data) => {
      setTodos((prevTodos) => {
        const newTodos = [...prevTodos];
        const indexTodo = newTodos.findIndex((item) => item.id === id);
        const { completed, title } = data as Todo;

        newTodos[indexTodo] = { ...newTodos[indexTodo], completed, title };

        return newTodos;
      });
    })
      .catch((error) => {
        setErrorMesage(TodoError.UnableUpdate);
        throw error;
      })
      .finally(() => {
        setIsLoader(false);
        setArrayLoader(null);
      });
  };

  const allCompleted = () => {
    const idCompleted: number[] = [];
    const changeValueCompleted = todos
      .some((todo) => !todo.completed);

    todos.forEach((todo) => {
      if (changeValueCompleted) {
        if (!todo.completed) {
          idCompleted.push(todo.id);
        }
      } else {
        if (todo.completed) {
          idCompleted.push(todo.id);
        }
      }

        handleUpdateTodo({ ...todo, completed: changeValueCompleted });
      });

    setArrayLoader(idCompleted);
  };

  const deletePerformedTask = () => {
    const idCompleted: number[] = [];

    filterTodos.forEach((todo) => {
      if (todo.completed) {
        idCompleted.push(todo.id);
      }
    });

    idCompleted.map(todo => handleDeleteTodo(todo));

    setArrayLoader(idCompleted);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMesage={setErrorMesage}
          sendTodo={sendTodo}
          queryInput={queryInput}
          setQueryInput={setQueryInput}
          allCompleted={allCompleted}
          isLoader={isLoader}
        />
        <TodoList
          todos={filterTodos}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          arrayLoader={arrayLoader}
          handleUpdateTodo={handleUpdateTodo}
          quryInput={queryInput}
        />
        {!!todos.length && (
          <Footer
            setChooseFilter={setChooseFilter}
            todos={filterTodos}
            chooseFilter={chooseFilter}
            deletePerformedTask={deletePerformedTask}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMesage={setErrorMesage}
        />
      )}
    </div>
  );
};
