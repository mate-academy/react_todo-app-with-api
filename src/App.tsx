/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  editTodo,
  getTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notifications } from './components/Notifications';

const USER_ID = 11399;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState({
    load: false,
    delete: false,
    empty: false,
    add: false,
    edit: false,
  });
  const [currentFilter, setCurrentFilter] = useState(TodoFilter.All);
  const [loadingId, setLoadingId] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filterTodos = (initTodos?: Todo[]) => {
    let filtered;

    if (initTodos) {
      filtered = [...initTodos];
    } else {
      filtered = [...todos];
    }

    switch (currentFilter) {
      case TodoFilter.Active:
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case TodoFilter.Completed:
        filtered = filtered.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    setVisibleTodos(filtered);
  };

  const loadTodos = () => {
    getTodos(USER_ID).then(items => {
      setTodos([...items]);
      filterTodos(items);
    }).catch(() => {
      setErrors(prevErrors => ({ ...prevErrors, load: true }));
    });
  };

  const removeTodo = (todoId: number) => {
    setLoadingId(prevTodoId => [...prevTodoId, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos
          .filter(todo => todo.id !== todoId));
        setLoadingId([]);
      })
      .catch(() => {
        setErrors(prevErrors => ({
          ...prevErrors,
          delete: true,
        }));
        setLoadingId([]);
      });
  };

  const addTodo = (newTitle: string) => {
    const maxId = Math.max(...todos.map(todo => todo.id));

    setTempTodo({
      id: 0,
      title: newTitle,
      completed: false,
      userId: USER_ID,
    });

    createTodo({
      id: maxId + 1,
      title: newTitle,
      completed: false,
      userId: USER_ID,
    })
      .then((newTodo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrors(prevErrors => ({
          ...prevErrors,
          add: true,
        }));
        setTempTodo(null);
      });
  };

  const changeTodo = (
    property: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    todoId: number,
  ) => {
    setLoadingId(prevTodoId => [...prevTodoId, todoId]);
    const oldTodo = todos.find((todo) => todo.id === todoId);

    if (oldTodo) {
      const updatedTodo: Todo = { ...oldTodo, [property]: value };

      editTodo(updatedTodo, todoId)
        .then(editedTodo => {
          setTodos(prevTodos => {
            const newTodos = [...prevTodos];

            const index = newTodos.findIndex(todo => todo.id === todoId);

            newTodos.splice(index, 1, editedTodo);

            return newTodos;
          });
          setLoadingId([]);
        })
        .catch(() => {
          setErrors(prevErrors => ({
            ...prevErrors,
            edit: true,
          }));
          setLoadingId([]);
        });
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    filterTodos();
  }, [currentFilter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          todos={todos}
          changeTodo={changeTodo}
          setErrors={setErrors}
        />

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            loadingId={loadingId}
            removeTodo={removeTodo}
            tempTodo={tempTodo}
            changeTodo={changeTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            todos={todos}
            removeTodo={removeTodo}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notifications
        errors={errors}
        setErrors={setErrors}
      />
    </div>
  );
};
