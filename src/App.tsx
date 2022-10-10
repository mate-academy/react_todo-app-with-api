import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Error } from './components/Errors/Error';
import { Errors } from './types/Errors';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setisAdding] = useState(true);
  const [title, setTitle] = useState('');
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [completedTodosId, setCompletedTododsId] = useState<number[]>([]);

  const user = useContext(AuthContext);

  let userId = 0;

  if (user?.id) {
    userId = user?.id;
  }

  useEffect(() => {
    getTodos(userId)
      .then(response => setTodos(response))
      .catch(() => setError(true));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.length) {
      setError(true);

      return setErrorMessage('Title can`t be empty');
    }

    if (user) {
      await postTodo(user.id, title)
        .then((newTodo: Todo) => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        });
    }

    setisAdding(false);

    return setTitle('');
  };

  const handleRemoveTodo = async (todoId: number) => {
    setSelectedId([todoId]);
    setisAdding(true);

    await deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });

    setisAdding(true);
  };

  const completedTodos = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const handleDeleteCompletedTodos = useCallback(() => {
    setCompletedTododsId([...completedTodos].map(({ id }) => id));

    Promise.any(completedTodos.map(({ id }) => handleRemoveTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setSelectedId([]);
      });
  }, [todos, selectedId, errorMessage]);

  const toggleAll = todos.every(({ completed }) => completed);
  const activeTodos = todos.filter(({ completed }) => !completed);
  const isCompletedTodos = todos.some(({ completed }) => completed);

  const handleOnChange = useCallback(
    async (updateId:number, data: Partial<Todo>) => {
      try {
        const changeStatus: Todo = await updateTodo(updateId, data);

        setTodos(todos.map(todo => (
          todo.id === updateId
            ? changeStatus
            : todo
        )));
      } catch {
        setErrorMessage(Errors.NotUpdate);
      }
    }, [todos],
  );

  const handleClickToggleAll = () => {
    if (activeTodos.length) {
      activeTodos.map(({ id }) => updateTodo(id, { completed: true })
        .catch(() => (setErrorMessage(Errors.NotUpdate))));
      setTodos(todos.map(todo => {
        const copy = todo;

        copy.completed = true;

        return copy;
      }));
    } else {
      todos.map(({ id }) => updateTodo(id,
        { completed: false }).catch(() => (
        setErrorMessage(Errors.NotUpdate))));
      setTodos(todos.map(todo => {
        const copy = todo;

        copy.completed = false;

        return copy;
      }));
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterBy) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return todos;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {todos && (
        <div className="todoapp__content">
          <Header
            title={title}
            setTitle={setTitle}
            handleSubmit={handleSubmit}
            toggleAll={toggleAll}
            handleToggleAll={handleClickToggleAll}
            todos={todos}

          />
          <TodoList
            todos={filteredTodos}
            OnRemove={handleRemoveTodo}
            selectedId={selectedId}
            isAdding={isAdding}
            completedTodosId={completedTodosId}
            title={title}
            handleOnChange={handleOnChange}
          />
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            isCompletedTodos={isCompletedTodos}
            activeTodos={activeTodos.length}
            onDelete={handleDeleteCompletedTodos}
          />
        </div>
      )}
      <Error
        errorMessage={errorMessage}
        error={error}
        setError={setError}
      />
    </div>
  );
};
