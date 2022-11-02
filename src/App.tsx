/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Filters } from './types/Filters';
import { Todo } from './types/Todo';
import { TodoList } from './components/Auth/TodoList';
import { Todos } from './components/Auth/Todo';
import { Filter } from './components/Auth/Filters';
import { ErroNotification } from './components/Auth/ErrorNot';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState<Filters>(Filters.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([]);
  const [selectedTodosId, setSelectedITodosId] = useState<number[]>([]);

  useEffect(() => {
    async function todosFromServer() {
      try {
        if (user) {
          const visibleTodos = await getTodos(user.id);

          setTodos(visibleTodos);
        }
      } catch (error) {
        setErrorMessage(`${error} ${user}`);
      }
    }

    todosFromServer();
  }, []);

  const filterTodoBy = todos.filter(todo => {
    switch (filterType) {
      case Filters.Active:

        return !todo.completed;

      case Filters.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      return setErrorMessage('Title can`t be empty');
    }

    setIsAdding(true);

    if (user) {
      try {
        const newTodo = await createTodo(user.id, title);

        setTodos([...todos, newTodo]);
      } catch {
        setErrorMessage('Unable to add a todo');
      }
    }

    setIsAdding(false);

    return setTitle('');
  };

  const handleremoveTodo = async (todoId: number) => {
    setSelectedITodosId([todoId]);
    setIsAdding(true);
    await deleteTodo(todoId);

    try {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setIsAdding(true);
  };

  const completedTodos = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const handleDeleteCompletedTodos = useCallback(() => {
    setCompletedTodosId([...completedTodos].map(({ id }) => id));

    Promise.any(completedTodos.map(({ id }) => handleremoveTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setSelectedITodosId([]);
      });
  }, [todos, selectedTodosId, errorMessage]);

  const toggleAllCompetedTodos = todos.every(({ completed }) => completed);
  const allActiveTodos = todos.filter(({ completed }) => !completed);

  const handleOnChange = useCallback(
    async (newId: number, data: Partial<Todo>) => {
      try {
        const makeCompleted: Todo = await updateTodo(newId, data);

        setTodos(todos.map(todo => (
          todo.id === newId
            ? makeCompleted
            : todo
        )));
      } catch {
        setErrorMessage('Unable to update a todo');
      }
    }, [todos],
  );

  const handleClickToggleAll = () => {
    if (allActiveTodos.length) {
      allActiveTodos.map(({ id }) => updateTodo(id,
        { completed: true })
        .catch(() => (
          setErrorMessage('Unable to update a todo'))));
      setTodos(todos.map(todo => {
        const newItem = todo;

        newItem.completed = true;

        return newItem;
      }));
    } else {
      todos.map(({ id }) => updateTodo(id,
        { completed: false }).catch(() => (
        setErrorMessage('Unable to update a todo'))));
      setTodos(todos.map(todo => {
        const newItem = todo;

        newItem.completed = false;

        return newItem;
      }));
    }
  };

  const isActiveTodos = todos.filter(({ completed }) => !completed);
  const isCompletedTodos = todos.some(({ completed }) => completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Todos
          setTitle={setTitle}
          title={title}
          handleSubmit={handleSubmit}
          toggleAllCompetedTodos={toggleAllCompetedTodos}
          handleToggleAll={handleClickToggleAll}
          todos={todos}
        />

        {(isAdding || todos.length > 0) && (
          <>
            <TodoList
              todos={filterTodoBy}
              removeTodo={handleremoveTodo}
              selectedTodoId={selectedTodosId}
              completedTodosId={completedTodosId}
              isAdding={isAdding}
              title={title}
              handleOnChange={handleOnChange}
            />

            {todos.length > 0 && (
              <Filter
                filterBy={filterType}
                setFilterBy={setFilterType}
                deleteTodo={handleDeleteCompletedTodos}
                isActiveTodos={isActiveTodos}
                isCompletedTodos={isCompletedTodos}

              />
            )}
          </>
        )}
      </div>
      {errorMessage
        && (
          <ErroNotification
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
    </div>
  );
};
