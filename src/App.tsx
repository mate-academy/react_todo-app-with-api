import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  getTodos,
  addTodo,
  patchTodo,
  removeTodo,
} from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

import { FilterBy } from './types/FilterBy';
import { Todo, TodoToPost } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const user: User | null = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  const [isAdding, setIsAdding] = useState(false);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed)
  ), [todos]);

  const getTodosFromApi = async () => {
    if (!user) {
      return;
    }

    try {
      const todosFromApi = await getTodos(user.id);

      setTodos(todosFromApi);
      setVisibleTodos(todosFromApi);
    } catch {
      setErrorMessage('Unable to load todos. Try reloading the page.');
    }
  };

  const filterTodos = useCallback(() => {
    const newVisibleTodos = todos.filter(({ completed }) => {
      switch (filterBy) {
        case FilterBy.Completed:
          return completed;

        case FilterBy.Active:
          return !completed;

        default:
          return true;
      }
    });

    setVisibleTodos(newVisibleTodos);
  }, [todos, filterBy]);

  const addTodoToServer = async (newTodoTitle: string) => {
    if (!user) {
      return;
    }

    try {
      setIsAdding(true);

      const todoToAdd: TodoToPost = {
        title: newTodoTitle,
        userId: user.id,
        completed: false,
      };

      const newTodo = await addTodo(todoToAdd);

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch {
      setErrorMessage('Todo could not be added. Try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const removeTodoFromServer = async (todoToRemoveId: number) => {
    try {
      await removeTodo(todoToRemoveId);
      setTodos(currentTodos => (
        currentTodos.filter(todo => todo.id !== todoToRemoveId)
      ));
    } catch {
      setErrorMessage('Unable to delete a todo. Try again.');
    }
  };

  const removeAllCompletedTodos = async () => {
    try {
      await Promise.all(completedTodos.map(({ id }) => (
        removeTodoFromServer(id)
      )));
    } catch {
      setErrorMessage('Unable to delete todos. Try again.');
    }
  };

  const toggleCompletedStatus = async (
    todoId: number,
    status: boolean,
  ) => {
    try {
      await patchTodo(todoId, { completed: status });
      await getTodosFromApi();
    } catch {
      setErrorMessage('Unable to change status of the todo.');
    }
  };

  const changeTodoTitle = async (
    todoId: number,
    title: string,
  ) => {
    try {
      await patchTodo(todoId, { title });
      await getTodosFromApi();
    } catch {
      setErrorMessage('Unable to change title of the todo.');
    }
  };

  const updateAll = async () => {
    try {
      await Promise.all(todos.map(todoItem => {
        const toggledTodo = {
          ...todoItem,
          completed: !todoItem.completed,
        };

        return patchTodo(todoItem.id, toggledTodo);
      }));

      setTodos(prevState => (
        prevState.map(todoItem => ({
          ...todoItem,
          completed: !todoItem.completed,
        }))
      ));
    } catch {
      setErrorMessage('Unable to update todos. Try again.');
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromApi();
  }, []);

  useEffect(filterTodos, [filterBy, todos]);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 4000);
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          newTodoField={newTodoField}
          addTodoToServer={addTodoToServer}
          isTodoBeingAdded={isAdding}
          setErrorMessage={setErrorMessage}
          updateAll={updateAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              removeTodoFromServer={removeTodoFromServer}
              toggleCompletedStatus={toggleCompletedStatus}
              changeTodoTitle={changeTodoTitle}
            />

            <Footer
              todosLeft={todos.filter(({ completed }) => !completed).length}
              todosDone={completedTodos.length}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              removeCompletedTodos={removeAllCompletedTodos}
            />
          </>
        )}
      </div>

      {errorMessage.length > 0 && (
        <ErrorMessage
          clearError={() => setErrorMessage('')}
        >
          {errorMessage}
        </ErrorMessage>
      )}
    </div>
  );
};
