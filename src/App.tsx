import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import {
  getTodos, addTodo, deleteTodo, changeTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { LoadedTodo } from './types/LoadedTodo';
import { ChangedTodo } from './types/ChangedTodo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAllTodosCompleted, setIsAllTodosCompleted] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [todoLoaded, setTodoLoaded]
    = useState<LoadedTodo>({ todoId: 0, loaded: false });

  function filterTodos(filterType: Filter, todosList: Todo[]): Todo[] {
    const todoActive = todosList.filter(todo => todo.completed === false);
    const todoCompleted = todosList.filter(todo => todo.completed === true);

    switch (filterType) {
      case Filter.active:
        setIsFooterVisible((todosList.length > todoActive.length));

        return todoActive;

      case Filter.completed:
        setIsFooterVisible(todosList.length > todoCompleted.length);

        return todoCompleted;

      case Filter.all:
        return todosList;

      default:
        return todosList;
    }
  }

  function loadTodos() {
    if (user) {
      getTodos(user.id)
        .then(result => setTodos(filterTodos(filter, result)))
        .catch(() => setErrorMessage('Unable to add a todo'));
    }
  }

  function checkTodos() {
    if (todos.every(todo => todo.completed === true)) {
      setIsAllTodosCompleted(true);

      return;
    }

    setIsAllTodosCompleted(false);
  }

  useEffect(() => {
    loadTodos();
    checkTodos();
  }, [todos]);

  useEffect(() => {
    setTimeout(() => setErrorMessage(''), 3000);
  }, [errorMessage]);

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
    const deletedTodo = todos.map(todo => (todo.completed === true
      ? deleteTodo(todo.id)
      : todo));

    setIsFooterVisible((todos.length > deletedTodo.length));
  };

  const handleToggleBtnClick = () => {
    setIsAllTodosCompleted(!isAllTodosCompleted);
    todos.map(todo => {
      return handleTodoChange(
        todo.id, { title: todo.title, completed: !isAllTodosCompleted },
      );
    });
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
          isAllTodosCompleted={isAllTodosCompleted}
          onToggleBtnClick={handleToggleBtnClick}
          onNewTodoFormSubmit={handleNewTodoFormSubmit}
        />

        {todos.length > 0
          && (
            <TodoList
              todos={todos}
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
