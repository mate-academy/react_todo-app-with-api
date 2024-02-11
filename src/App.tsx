/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, USER_ID } from './types/Todo';
import { ErrorTp } from './types/error';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Errors } from './components/Errors';
import { FilterType } from './types/FilterType';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState<ErrorTp | null>(null);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrors(ErrorTp.load_error));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.completed:
        return todos.filter(todo => todo.completed);

      case FilterType.active:
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, [todos, filterType]);

  const addTodo = (title: string) => {
    createTodo({
      title,
      completed: false,
      userId: USER_ID,
    })
      .then((newTodo) => {
        setTodos((prevTodos: Todo[]) => [...prevTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(() => ErrorTp.title_error);
  };

  const updatingTodo = (updatedTodo: Todo) => {
    updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodo => {
          const newTodo = [...currentTodo];
          const index = newTodo.findIndex(uptodo => uptodo.id === updatedTodo.id);

          newTodo.splice(index, 1, todo);

          return newTodo;
        });
      });
  };

  const handelChangFilter = (filter: FilterType) => {
    setFilterType(filter);
  };

  const handlClearCompleted = () => {
    const completedTodoIds = todos.filter(todo => todo.completed).map(todo => todo.id);

    if (completedTodoIds.length > 0) {
      Promise.all(completedTodoIds.map(todoId => deleteTodo(todoId)))
        .then(() => {
          const newTodos = todos.filter(todo => !todo.completed);

          setTodos(newTodos);
        });
    }
  };

  const someNotCompleted = todos.some(todo => !todo.completed);

  const handelToggleAll = () => {
    if (someNotCompleted) {
      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed: someNotCompleted,
      }));

      Promise.all(updatedTodos.map(updateTodo)).then(updatedTodoss => {
        setTodos(updatedTodoss);
      });
    } else {
      const otherUppdatedTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));

      Promise.all(otherUppdatedTodos.map(updateTodo)).then(updatedTodoss => {
        setTodos(updatedTodoss);
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTempTodo={setTempTodo}
          handelToggleAll={handelToggleAll}
          todos={todos}
          createNewTodo={addTodo}
          setErrors={setErrors}
        />

        <TodoList
          tempTodo={tempTodo}
          onUpdate={updatingTodo}
          setTodos={setTodos}
          todos={filterTodos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterChange={handelChangFilter}
            filterType={filterType}
            deleteCompleted={handlClearCompleted}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Errors errors={errors} />
    </div>
  );
};
