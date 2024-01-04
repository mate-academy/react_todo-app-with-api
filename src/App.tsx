/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
// import { UserWarning } from './UserWarning';
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
  const [chooseFilter, setChooseFilter] = useState<string>(FilterTodos.All);
  const [errorMessage, setErrorMesage] = useState<string | null>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoader, setIsLoader] = useState(false);
  const [quryInput, setQuryInput] = useState('');
  const [arryLoader, setArryLoader] = useState<number[] | null>([]);

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
      title, completed, id: 0, userId: USER_ID,
    });

    setArryLoader([0]);
    setIsLoader(true);
    createTodo({
      title, completed, userId: USER_ID,
    })
      .then((todo) => {
        setTodos((currentTodo) => [...currentTodo, todo]);
        setQuryInput('');
      })
      .catch((error) => {
        setErrorMesage(TodoError.UnableAdd);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoader(false);
        setArryLoader(null);
      });
  };

  const handlDdeleteTodo = (id: number) => {
    setIsLoader(true);
    setArryLoader([id]);
    deleteTodo(id)
      .then(() => setTodos((currentTodos) => currentTodos
        .filter(todo => todo.id !== id)))
      .catch((error) => {
        setErrorMesage(TodoError.UnableDelete);
        throw error;
      })
      .finally(() => {
        setIsLoader(false);
        setArryLoader(null);
      });
  };

  const handlUpdateTodo = (todo: Todo) => {
    const { id } = todo;

    setArryLoader([id]);
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
        setArryLoader(null);
      });
  };

  const allCompleted = () => {
    const idCompleted: number[] = [];
    const chaangeValueCompleted = todos
      .some((todo) => todo.completed === false);

    if (chaangeValueCompleted) {
      todos.forEach((todo) => {
        if (!todo.completed) {
          idCompleted.push(todo.id);
        }

        handlUpdateTodo({ ...todo, completed: true });
      });
    } else {
      todos.forEach((todo) => {
        if (todo.completed) {
          idCompleted.push(todo.id);
        }

        handlUpdateTodo({ ...todo, completed: false });
      });
    }

    setArryLoader(idCompleted);
  };

  const deletePerformedTask = () => {
    const idCompleted: number[] = [];

    filterTodos.forEach((todo) => {
      if (todo.completed) {
        idCompleted.push(todo.id);
      }
    });

    idCompleted.map(todo => handlDdeleteTodo(todo));

    setArryLoader(idCompleted);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMesage={setErrorMesage}
          sendTodo={sendTodo}
          quryInput={quryInput}
          setQuryInput={setQuryInput}
          allCompleted={allCompleted}
          isLoader={isLoader}
        />
        <TodoList
          todos={filterTodos}
          tempTodo={tempTodo}
          handlDdeleteTodo={handlDdeleteTodo}
          arryLoader={arryLoader}
          handlUpdateTodo={handlUpdateTodo}
          quryInput={quryInput}
        />
        {todos.length > 0 && (
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
