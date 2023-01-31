/* eslint-disable jsx-a11y/control-has-associated-label */
// eslint-disable-next-line object-curly-newline
import React, { useEffect, useMemo, useRef, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import { filterTotos } from './helpers/filter';
import {
  ErrorNotification,
  Header,
  TodoList,
  Footer,
  useAuthContext,
} from './components';
import { Todo, FilterTypes, ErrorTypes } from './types';

export const App: React.FC = () => {
  const user = useAuthContext();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [typeFilter, setTypeFilter] = useState(FilterTypes.All);
  const [error, setError] = useState('');
  const [isErrorNoteShown, setErrorNoteShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRenamingTodo, setIsRenamingTodo] = useState(false);
  const [selectedTodoById, setSelectedTodoById] = useState(0);
  const newTodoField = useRef<HTMLInputElement>(null);

  const visibleTodos = filterTotos(todos, typeFilter);
  const activeTodosCount = useMemo(
    () => filterTotos(todos, FilterTypes.Active).length,
    [todos],
  );
  const completedTodosCount = useMemo(
    () => filterTotos(todos, FilterTypes.Completed).length,
    [todos],
  );
  const allCompleted = todos.length === completedTodosCount;

  function showErrorNote() {
    setErrorNoteShown(true);
    setTimeout(() => {
      setErrorNoteShown(false);
    }, 3000);
  }

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      setIsLoading(true);
      getTodos(user.id)
        .then((res) => setTodos(res))
        .catch(() => {
          setError(ErrorTypes.Loading);
          showErrorNote();
        })
        .finally(() => setIsLoading(false));
    }
  }, [todos.length]);

  const addTodoHandler = (titleTodo: string) => {
    if (!user) {
      return;
    }

    if (!titleTodo.trim()) {
      setTitle('');
      setError(ErrorTypes.Empty);
      showErrorNote();

      return;
    }

    const todo = {
      title: titleTodo,
      userId: user?.id,
      completed: false,
    };

    setIsLoading(true);

    createTodo(todo)
      .then((res) => setTodos((prevTodos) => [...prevTodos, res]))
      .catch(() => {
        setError(ErrorTypes.Add);
        showErrorNote();
      })
      .finally(() => {
        setTitle('');
        setIsLoading(false);
      });
  };

  const deleteTodoHandler = (id: number) => {
    deleteTodo(id)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorTypes.Remove);
        showErrorNote();
      });
  };

  const deleteCompletedTodosHandler = () => {
    todos.forEach((todo) => (
      todo.completed ? deleteTodoHandler(todo.id) : todo));
  };

  const updateStateTodoHandler = (id: number, state: boolean) => {
    updateTodo(id, state).then((res) => {
      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === res.id
        ? { ...todo, completed: res.completed }
        : { ...todo })));
    });
  };

  const toggleTodoHandler = (id: number) => {
    const selectedTodo = todos.find((todo) => id === todo.id);
    const updateCompleted = !selectedTodo?.completed;

    if (!selectedTodo) {
      return;
    }

    updateStateTodoHandler(id, updateCompleted);
  };

  const completedAllTodoHandler = () => {
    todos.forEach((todo) => (allCompleted
      ? updateStateTodoHandler(todo.id, false)
      : updateStateTodoHandler(todo.id, true)));
  };

  const updateTitleTodoHandler = (value: string) => {
    setIsRenamingTodo(false);

    if (!value.trim()) {
      deleteTodoHandler(selectedTodoById);

      return;
    }

    updateTodo(selectedTodoById, value).then((res) => {
      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === res.id
        ? { ...todo, title: res.title }
        : { ...todo })));
    }).catch(() => {
      setError(ErrorTypes.Update);
      showErrorNote();
    });
  };

  const dblClickHandler = (id: number) => {
    setIsRenamingTodo(true);
    setSelectedTodoById(id);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          ref={newTodoField}
          title={title}
          setTitle={setTitle}
          onAddToto={addTodoHandler}
          isLoading={isLoading}
          completedAllTodo={completedAllTodoHandler}
          allCompleted={allCompleted}
        />
        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodoHandler}
          toggleTodo={toggleTodoHandler}
          isRenamingTodo={isRenamingTodo}
          setIsRenamingTodo={setIsRenamingTodo}
          selectedTodoById={selectedTodoById}
          dblClickHandler={dblClickHandler}
          updateTitleTodo={updateTitleTodoHandler}
        />
        {!!todos.length && (
          <Footer
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            completedTodosCount={completedTodosCount}
            activeTodosCount={activeTodosCount}
            deleteCompletedTodos={deleteCompletedTodosHandler}
          />
        )}
      </div>
      <ErrorNotification
        isErrorNoteShown={isErrorNoteShown}
        setErrorNoteShown={setErrorNoteShown}
        error={error}
      />
    </div>
  );
};
