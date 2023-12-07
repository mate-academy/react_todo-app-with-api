import React, { useEffect, useState } from 'react';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { NewTodo, Todo } from './types/Todo';
import { Status } from './types/Statuses';
import { ErrorNotification } from './components/ErrorNotification';
import { Errors } from './types/Errors';
import { TodoHeader } from './components/TodoHeader';
import { TodoItem } from './components/TodoItem';
import { USER_ID } from './helpers/userId';
import {
  addTodo,
  updateTodo,
  deleteTodo,
  getTodos,
} from './api/todos';

const applyFilter = (todos: Todo[], filter: Status) => {
  const conditions = {
    [Status.All]: () => {
      return todos;
    },
    [Status.Active]: () => {
      return todos.filter(todo => !todo.completed);
    },
    [Status.Completed]: () => {
      return todos.filter(todo => todo.completed);
    },
  };

  if (filter in conditions) {
    return conditions[filter]();
  }

  return todos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<Errors | ''>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [title, setTitle] = useState('');
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [submittedTitle, setSubmittedTitle] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LoadError));
  }, []);

  const filteredTodos = applyFilter(todos, filter);

  const handleUpdateTodo = async (updatedTodo: Todo): Promise<void> => {
    try {
      const result = await updateTodo(updatedTodo);

      setTodos((currentTodos) => {
        const newTodos = currentTodos.map((item) => (
          item.id === result.id ? result : item
        ));

        return newTodos;
      });

      if (title.trim() !== '' && title.trim() !== result.title) {
        setErrorMessage(Errors.UpdateTodoError);
      } else {
        setErrorMessage('');
      }

      setTitle('');
    } catch (error) {
      setErrorMessage(Errors.UpdateTodoError);
    } finally {
      setCurrentId(null);
    }
  };

  const handleAddTodo = async (newTodo: NewTodo, userId: number) => {
    setTitle('');
    setIsDisabledInput(true);
    setTempTodo({ id: 0, ...newTodo });
    setCurrentId(0);

    await addTodo({ ...newTodo, userId })
      .then((todo: Todo) => {
        setTodos((currentTodos) => [...currentTodos, todo]);
      })
      .catch(() => {
        setTitle(title);
        setErrorMessage(Errors.AddTodoError);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabledInput(false);
        setCurrentId(null);
      });
  };

  const handleDeleteTodo = async (todo: Todo) => {
    setCurrentId(todo.id);
    setIsDisabledInput(true);

    try {
      await deleteTodo(todo.id);

      setTodos(current => current.filter(item => item.id !== todo.id));
    } catch (error) {
      setErrorMessage(Errors.DeleteTodoError);
    } finally {
      setTempTodo(null);
      setCurrentId(null);
      setIsDisabledInput(false);
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map((todo) => handleDeleteTodo(todo)));

      setTodos((current) => current.filter((item) => !item.completed));
    } catch (error) {
      setErrorMessage(Errors.DeleteTodoError);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          userId={USER_ID}
          title={title}
          setTodos={setTodos}
          setTitle={setTitle}
          handleUpdateTodo={handleUpdateTodo}
          handleAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          isDisabledInput={isDisabledInput}
          setSubmittedTitle={setSubmittedTitle}
          submittedTitle={submittedTitle}
        />
        <TodoList
          todos={filteredTodos}
          currentId={currentId}
          handleUpdateTodo={handleUpdateTodo}
          handleDeleteTodo={handleDeleteTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
        />
        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            currentId={currentId}
            handleDeleteTodo={handleDeleteTodo}
            handleUpdateTodo={handleUpdateTodo}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
            setTodos={setTodos}
          />
        )}

        {!!todos.length && (
          <TodoFooter
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      <ErrorNotification error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
