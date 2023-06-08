import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { FormTodo } from './component/FormTodo/FormTodo';
import { MainTodo } from './component/MainTodo/MainTodo';
import { Footer } from './component/Footer/Footer';
import { Error } from './component/Error/Error';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { client } from './utils/fetchClient';
import { FilterByWords } from './types/enums';

const USER_ID = 10599;

export const App: React.FC = () => {
  const [todos, setFormValue] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterByWords.All);
  const [error, setError] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isCompletedTodos, setIsCompletedTodos] = useState<boolean>(false);
  const [todosCounter, setTodosCounter] = useState<number>(0);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setFormValue)
      .catch((err: Error) => {
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    if (tempTodo !== null) {
      setTempTodo(null);
    }

    const todoCounter = todos.filter(todo => !todo.completed).length;

    setTodosCounter(todoCounter);

    const hasIncompleteTodos = todos.some((todo) => todo.completed);

    setIsCompletedTodos(hasIncompleteTodos);
  }, [todos]);

  const addNewTodo = (newTodo: string) => {
    if (newTodo.trim() === '') {
      setError("Title can't be empty");

      return;
    }

    setIsInputDisabled(true);

    setTempTodo({
      id: 0,
      title: newTodo,
      completed: false,
      userId: USER_ID,
    });

    client
      .post('/todos?userId=10599', {
        title: newTodo,
        completed: false,
        userId: USER_ID,
      })
      .then((response) => {
        const newTodos = Array.isArray(response) ? response[0] : response;

        setFormValue((prevTodos) => [...prevTodos, newTodos]);
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsInputDisabled(false);
      });
  };

  const deleteToDo = (todoId: number) => {
    client
      .delete(`/todos/${todoId}`)
      .then(() => {
        setFormValue((prevTodos) => prevTodos
          .filter((todo) => todo.id !== todoId));
      })
      .catch((err) => {
        setError(err);
      });
  };

  const completedTodo = (todoId: number) => {
    const updatedTodos = todos.map((elem) => (elem.id === todoId
      ? { ...elem, completed: !elem.completed }
      : elem));

    client
      .patch(`/todos/${todoId}`, { completed: !todos.find((elem) => elem.id === todoId)?.completed })
      .then(() => {
        setFormValue(updatedTodos);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const copyTodoArray = useMemo(() => {
    switch (filterStatus) {
      case FilterByWords.Active:
        return todos.filter((elem) => !elem.completed);
      case FilterByWords.Completed:
        return todos.filter((elem) => elem.completed);
      default:
        return todos;
    }
  }, [filterStatus, todos]);

  const closeErrorBanner = (value: string) => {
    setError(value);
  };

  const clearCompletedTodos = () => {
    const completedTodoIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    completedTodoIds.map((id) => client
      .delete(`/todos/${id}`)
      .then(() => {
        setFormValue((prevTodos) => prevTodos
          .filter((todo) => !completedTodoIds.includes(todo.id)));
      })
      .catch((err) => {
        setError(err.message);
      }));
  };

  const selectAllCompletedTodos = () => {
    const hasFalse = todos.some((todo) => !todo.completed);

    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !!hasFalse,
    }));

    Promise.all(
      updatedTodos
        .map((todo) => client
          .patch(`/todos/${todo.id}`, todo)),
    )
      .then(() => {
        setFormValue(updatedTodos);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const setEditableTodo = (editedTodo: Todo) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === editedTodo.id) {
        return {
          ...todo,
          title: editedTodo.title,
        };
      }

      return todo;
    });

    client
      .patch(`/todos/${editedTodo.id}`, { title: editedTodo.title })
      .then(() => {
        setFormValue(updatedTodos);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <FormTodo
          addNewTodo={addNewTodo}
          isInputDisabled={isInputDisabled}
          selectAllCompletedTodos={selectAllCompletedTodos}
          todosLength={todos.length}
          isCompletedTodos={isCompletedTodos}
        />

        <MainTodo
          todos={copyTodoArray}
          deleteToDo={deleteToDo}
          tempTodo={tempTodo}
          completedTodo={completedTodo}
          setEditableTodo={setEditableTodo}
        />
        {todos.length >= 1 ? (
          <footer className="todoapp__footer">
            <Footer
              setFilterHandler={setFilterStatus}
              todoCounter={todosCounter}
              isCompletedTodos={isCompletedTodos}
              clearCompletedTodos={clearCompletedTodos}
            />
          </footer>
        ) : null}
      </div>

      <Error
        error={error}
        closeErrorBanner={closeErrorBanner}
      />
    </div>
  );
};
