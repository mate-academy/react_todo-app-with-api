import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo,
  updateTodoTitle,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { Header } from './components/Auth/Header';
import { TodoList } from './components/Auth/TodoList';
import { FooterTodo } from './components/Auth/FooterTodo';
import { Loader } from './components/Auth/Loader';
import { ErrorType } from './types/ErrorType';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [value, setValue] = useState('');
  const [error, setError] = useState(ErrorType.None);
  const [currentFilter, setCurrentFilter] = useState(Filters.All);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNewName, setIsLoadingNewName] = useState(false);

  const areTodosCompleted = !!todos.find((todo) => !todo.completed);

  const updateTodoCompleted = (todoNew: Todo) => {
    setTodos(
      todos.map((todo) => (
        todo.id !== todoNew.id ? todo : { ...todo, completed: !todo.completed }
      )),
    );
  };

  const updateTODOCompleted = (todoNew: Todo) => {
    updateTodo(todoNew.id, !todoNew.completed)
      .then((todo) => updateTodoCompleted(todo))
      .catch(() => setError(ErrorType.UpdatedError));
  };

  const updateTodoName = (todoNew: Todo) => {
    setTodos(
      todos.map((todo) => (
        todo.id !== todoNew.id ? todo : { ...todo, title: todoNew.title }
      )),
    );
  };

  const updateTODOTitle = (todoId: number | undefined, title: string) => {
    updateTodoTitle(todoId, title)
      .then((todo) => {
        updateTodoName(todo);
      })
      .catch(() => {
        setError(ErrorType.UpdatedError);
        setIsLoadingNewName(true);
      });
  };

  const completedTodo = todos.filter((todo) => todo.completed);

  const clearCompleted = () => {
    completedTodo.filter((todo) => deleteTodo(todo.id)
      .then()
      .catch(() => setError(ErrorType.RemoveError)));
  };

  const setStatusCompleted = () => {
    todos.forEach((todo) => updateTodo(todo.id, !todo.completed)
      .then(() => setTodos(todos.map((tod) => ({ ...tod, completed: true }))))
      .catch(() => setError(ErrorType.UpdatedError)));
  };

  const setStatusNotCompleted = () => {
    todos.forEach((toDo) => updateTodo(toDo.id, !toDo.completed)
      .then(() => setTodos(todos.map((t) => ({ ...t, completed: false }))))
      .catch(() => setError(ErrorType.UpdatedError)));
  };

  const updateTodos = (todoId: unknown) => setTodos(
    todos.filter((todo) => todo.id !== todoId),
  );

  const removeTodo = (todoId: number | undefined) => {
    deleteTodo(todoId)
      .then((todoID) => {
        updateTodos(todoID);
        setIsLoading(false);
      })
      .catch(() => setError(ErrorType.RemoveError));
  };

  const addNewTodo = (todo: Todo) => setTodos([...todos, todo]);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (value !== '') {
        event.preventDefault();
        createTodo(value, user?.id)
          .then((todo) => addNewTodo(todo))
          .catch(() => setIsAdding(true));
        setValue('');
      } else {
        setError(ErrorType.UpdatedError);
      }
    }
  };

  useMemo(() => {
    getTodos(user?.id)
      .then((todoss) => {
        setTodos(todoss);
        setIsLoading(false);
      })
      .catch(() => setError(ErrorType.LoadError));

    setIsAdding(true);
  }, [todos]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const filterList = (
    todoss: Todo[],
  ): Todo[] | undefined => todoss.filter((todo) => {
    if (!todo) {
      return [];
    }

    switch (currentFilter) {
      case Filters.Active:
        return !todo.completed;

      case Filters.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  const filteredList = useMemo(() => filterList(todos), [currentFilter, todos]);

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            value={value}
            setValue={setValue}
            handleKeyDown={handleKeyDown}
            isAdding={isAdding}
            areTodosCompleted={areTodosCompleted}
            setStatusCompleted={setStatusCompleted}
            setStatusNotCompleted={setStatusNotCompleted}
          />
          {todos.length !== 0 && (
            <>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <TodoList
                    filteredList={filteredList}
                    removeTodo={removeTodo}
                    updateTODOCompleted={updateTODOCompleted}
                    updateTODOTitle={updateTODOTitle}
                    isLoadingNewName={isLoadingNewName}
                  />
                  <FooterTodo
                    todos={todos}
                    setCurrentFilter={setCurrentFilter}
                    clearCompleted={clearCompleted}
                    currentFilter={currentFilter}
                  />
                </>
              )}
            </>
          )}
          {error !== ErrorType.None && (
            <ErrorNotification
              error={error}
              setError={setError}
            />
          )}
        </div>
      </div>
    </>
  );
};
