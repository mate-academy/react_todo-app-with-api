/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useRef, useState, useContext, useCallback, FormEvent, useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterTypes } from './types/FilterType';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { TodoList } from './components/Todolist';
import {
  getTodos,
  createTodo,
  deleteTodos,
  updateTodo,
} from './api/todos';

export function getFilterTodos(
  todos: Todo[],
  filterTypes: FilterTypes,
) {
  const filterTodo = [...todos];

  switch (filterTypes) {
    case FilterTypes.Active:
      return filterTodo.filter(({ completed }) => !completed);

    case FilterTypes.Completed:
      return filterTodo.filter(({ completed }) => completed);

    default:
      return filterTodo;
  }
}

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext<User | null>(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<FilterTypes>(FilterTypes.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isAdding, setAdding] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    const todoFromServer = async (userId: number) => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(`${error}`);
      }
    };

    if (!user) {
      return;
    }

    todoFromServer(user.id);
  }, []);

  const addNewTodo = useCallback(async (event:FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !user) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setAdding(true);

    try {
      const newTodo = await createTodo(user.id, title);

      setTodos(prevTodo => ([...prevTodo, newTodo]));
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setAdding(false);
      setTitle('');
    }
  }, [title, user]);

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds([todoId]);
    const removedTodo = async () => {
      try {
        await deleteTodos(todoId);

        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      } catch {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setLoadingTodoIds([]);
      }
    };

    removedTodo();
  };

  const changeTodo = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      setLoadingTodoIds([todoId]);
      try {
        const renameTodo = await updateTodo(todoId, data);

        setTodos(todos.map(todo => (
          todo.id === todoId
            ? renameTodo
            : todo
        )));
      } catch {
        setErrorMessage('Unable to update a todo');
      } finally {
        setLoadingTodoIds([]);
      }
    }, [todos],
  );

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const deleteCompletedTodos = useCallback(() => {
    Promise.all(completedTodos.map(({ id }) => deleteTodo(id)))
      .then(() => setTodos((prevTodos) => prevTodos
        .filter(({ completed }) => !completed)))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  }, [todos, errorMessage]);

  const filteredTodos = useMemo(() => (
    getFilterTodos(todos, filterBy)
  ), [todos, filterBy]);

  const todoActive = useMemo(
    () => (todos.filter(todo => !todo.completed)
    ), [todos],
  );

  const handleToggleAll = () => {
    const newStatus = todos.some(({ completed }) => completed === false);
    const todosIds = todos.filter(todo => todo.completed !== newStatus)
      .map(todo => todo.id);

    setLoadingTodoIds(todosIds);

    todosIds.map(async (todoId) => {
      try {
        await updateTodo(todoId, {
          completed: newStatus,
        });
      } catch {
        setErrorMessage('Unable to change status');
      } finally {
        setLoadingTodoIds(prevTodosIds => (
          prevTodosIds.filter(prevTodoId => prevTodoId !== todoId)
        ));
      }
    });

    setTodos(prevTodos => prevTodos
      .map(todo => (
        todosIds.includes(todo.id) ? ({
          ...todo,
          completed: newStatus,
        })
          : todo
      )));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addNewTodo={addNewTodo}
          title={title}
          setTitle={setTitle}
          handleToggleAll={handleToggleAll}
          todoActive={todoActive}
        />

        {(isAdding || todos) && (
          <>
            <TodoList
              newTodoField={newTodoField}
              todos={filteredTodos}
              title={title}
              isAdding={isAdding}
              deleteTodo={deleteTodo}
              loadingTodoIds={loadingTodoIds}
              changeTodo={changeTodo}
            />
            <Footer
              getFilterTodo={setFilterBy}
              selectedTab={filterBy}
              deleteCompletedTodos={deleteCompletedTodos}
              todos={todos}
              todoActive={todoActive}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
