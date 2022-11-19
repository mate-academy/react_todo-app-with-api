import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  removeTodo,
  chandeTodoStatus,
} from './api/todos';
import { Errors } from './components/Errors';
import { Footer } from './components/Footer';
import { FilterMethods } from './types/FilterMethods';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterMethod, setFilterMethod]
  = useState<FilterMethods>(FilterMethods.ALL);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTodosId, setActiveTodosId] = useState<number[]>([]);

  const getTodosFromsServer = async () => {
    if (!user) {
      return;
    }

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    } catch (Error) {
      setErrorMessage('Loading error!');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  useEffect(() => {
    getTodosFromsServer();
  }, [todos]);

  const filteredTodos = todos.filter(({ completed }) => {
    switch (filterMethod) {
      case FilterMethods.COMPLETED:
        return completed;

      case FilterMethods.ACTIVE:
        return !completed;

      default:
        return true;
    }
  });

  const addNewTodo = async (newTitle: string) => {
    const newId = -(todos.length);

    if (!user) {
      return;
    }

    setActiveTodosId(prevState => [...prevState, newId]);

    try {
      setIsAdding(true);

      const todoToAdd = {
        title: newTitle,
        userId: user.id,
        completed: false,
      };

      const newTodo = await addTodo(todoToAdd);

      setIsAdding(false);
      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTitle('');
      setIsAdding(false);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    setActiveTodosId(prevState => prevState.filter(
      item => item === newId,
    ));
  };

  const activeTodos = todos.filter((todo) => (
    !todo.completed
  ));

  const completedTodos = todos.filter((todo) => (
    todo.completed
  ));

  const deleteTodo = async (id: number) => {
    setActiveTodosId(prevState => [...prevState, id]);

    try {
      await removeTodo(id);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    setActiveTodosId(prevState => prevState.filter(item => item === id));
  };

  const removeCompletedTodos = async () => {
    setIsAdding(true);

    try {
      await Promise.all(completedTodos.map(async (todo) => {
        await removeTodo(todo.id);
      }));
      getTodosFromsServer();
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsAdding(false);
    }
  };

  const togleStatus = async (
    id: number,
    completed: boolean,
    activateLoader:(val: boolean) => void,
  ) => {
    setActiveTodosId(prevState => [...prevState, id]);

    try {
      activateLoader(true);
      await chandeTodoStatus(id, !completed);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      activateLoader(false);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      activateLoader(false);
    }

    setActiveTodosId(prevState => prevState.filter(item => item !== id));
  };

  const toggleAllTodos = async () => {
    const activeIds = activeTodos.map((todo) => todo.id);
    const completedIds = completedTodos.map((todo) => todo.id);
    const allIds = todos.map((todo) => todo.id);

    try {
      if (completedTodos.length >= activeTodos.length) {
        setActiveTodosId(prevState => [...prevState, ...activeIds]);
        await Promise.all(activeTodos
          .map((todo) => chandeTodoStatus(todo.id, true)));
        setActiveTodosId([]);
      }

      if (completedTodos.length < activeTodos.length) {
        setActiveTodosId(prevState => [...prevState, ...completedIds]);
        await Promise.all(completedTodos
          .map((todo) => chandeTodoStatus(todo.id, false)));
        setActiveTodosId([]);
      }

      if (completedTodos.length === todos.length
        || activeTodos.length === todos.length) {
        setActiveTodosId(prevState => [...prevState, ...allIds]);
        await Promise.all(todos
          .map((todo) => chandeTodoStatus(todo.id, !todo.completed)));
        setActiveTodosId([]);
      }
    } catch {
      setErrorMessage('Unable to update a todo');
      setActiveTodosId([]);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          todos={filteredTodos}
          title={title}
          setTitle={setTitle}
          addNewTodo={addNewTodo}
          isAdding={isAdding}
          setErrorMessage={setErrorMessage}
          completedTodos={completedTodos}
          toggleAllTodos={toggleAllTodos}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              isAdding={isAdding}
              title={title}
              setErrorMessage={setErrorMessage}
              deleteTodo={deleteTodo}
              togleStatus={togleStatus}
              activeTodosId={activeTodosId}
            />

            <Footer
              filterMethod={filterMethod}
              setFilterMethod={setFilterMethod}
              todosLeft={activeTodos}
              completedTodos={completedTodos}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <Errors
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
