import React, {
  useContext, useEffect, useState, useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import {
  getTodos, addTodo, deleteTodo, changeTodo,
} from './api/todos';
import { Todo } from './types/Todo/Todo';
import { Filter } from './types/Filter';
import { LoadedTodo } from './types/Todo/LoadedTodo';
import { ChangedTodo } from './types/Todo/ChangedTodo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [todoLoaded, setTodoLoaded]
    = useState<LoadedTodo>({ todoId: 0, loaded: false });
  let isFooterVisible = false;

  const loadTodos = async (userId: number) => {
    try {
      const todosFromServer = await getTodos(userId);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage('Can not load todos');
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    loadTodos(user.id);
  }, [user?.id, todoLoaded]);

  useEffect(() => {
    setTimeout(() => setErrorMessage(''), 3000);
  }, [errorMessage]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.active:
          return !todo.completed;

        case Filter.completed:
          return todo.completed;

        case Filter.all:
          return todo;

        default:
          return todo;
      }
    });
  }, [todos, filter]);

  function addNewTodo() {
    if (!user) {
      return;
    }

    const newTodo = {
      userId: user.id,
      title,
      completed: false,
    };

    addTodo(newTodo)
      .then(result => {
        setTodos((prevTodos) => (
          [...prevTodos, result]
        ));
      })
      .catch(() => setErrorMessage('Unable to add a todo'));
  }

  const handleTodoRemove = (id: number) => {
    deleteTodo(id)
      .then(() => setTodoLoaded({ todoId: id, loaded: true }))
      .catch(() => setErrorMessage('Unable to delete a todo'));
  };

  const handleTodoChange = (id: number, data: ChangedTodo) => {
    changeTodo(id, data)
      .then(() => setTodoLoaded({ todoId: id, loaded: true }))
      .catch(() => setErrorMessage('Unable to update a todo'));
  };

  const handleClearCompletedTodos = () => {
    const activeTodo = todos.filter(todo => !todo.completed);

    isFooterVisible = activeTodo.length > 0;
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });

    setTodos(activeTodo);
  };

  const handleToggleBtnClick = (todoCompleted: boolean) => {
    todos.forEach(todo => {
      handleTodoChange(
        todo.id,
        { ...todo, title: todo.title, completed: !todoCompleted },
      );
    });

    setTodos(todos.map(todo => {
      return { ...todo, completed: !todoCompleted };
    }));
  };

  const handleNewTodoFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title can not be empty');

      return;
    }

    addNewTodo();
    setTitle('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          setTitle={setTitle}
          onToggleBtnClick={handleToggleBtnClick}
          onNewTodoFormSubmit={handleNewTodoFormSubmit}
        />

        {todos.length > 0
          && (
            <TodoList
              todos={visibleTodos}
              onTodoRemove={handleTodoRemove}
              onTodoChange={handleTodoChange}
              todoLoaded={todoLoaded}
              setTodoLoaded={setTodoLoaded}
            />
          )}
        <Footer
          todos={todos}
          onClearCompletedTodos={handleClearCompletedTodos}
          filter={filter}
          setFilter={setFilter}
          isFooterVisible={isFooterVisible}
        />
      </div>

      {(errorMessage && !title)
        && (
          <ErrorNotification
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
    </div>
  );
};
