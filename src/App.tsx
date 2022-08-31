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

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAllTodosCompleted, setAllTodosCompleted] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [isFooterVisible, setFooterVisible] = useState(false);
  const [todoLoaded, setTodoLoaded]
    = useState<LoadedTodo>({ todoId: 0, loaded: true });

  function filterTodos(filterType: Filter, todosList: Todo[]): Todo[] {
    switch (filterType) {
      case Filter.active:
        setFooterVisible((todosList.length > todosList
          .filter(todo => todo.completed === false).length));

        return todosList.filter(todo => todo.completed === false);

      case Filter.completed:
        setFooterVisible(todosList.length > todosList
          .filter(todo => todo.completed === true).length);

        return todosList.filter(todo => todo.completed === true);

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
      setAllTodosCompleted(true);

      return;
    }

    setAllTodosCompleted(false);
  }

  useEffect(() => {
    loadTodos();
    checkTodos();
  }, [todos]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [errorMessage]);

  function addNewTodo() {
    if (user) {
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
  }

  const handleTodoRemove = (id: number) => {
    deleteTodo(id)
      .then(() => setTodoLoaded({ todoId: id, loaded: true }))
      .catch(() => setErrorMessage('Unable to delete a todo'));
  };

  const handleTodoChange = (id: number, data: any) => {
    changeTodo(id, data)
      .then(() => setTodoLoaded({ todoId: id, loaded: true }))
      .catch(() => setErrorMessage('Unable to update a todo'));
  };

  const handleClearCompletedTodos = () => {
    const completedTodo: Todo[] = todos.filter(todo => todo.completed === true);

    for (let i = 0; i < completedTodo.length; i += 1) {
      setTimeout(() => deleteTodo(completedTodo[i].id));
    }

    setFooterVisible((todos.length > completedTodo.length));
  };

  const handleToggleBtnClick = () => {
    setAllTodosCompleted(!isAllTodosCompleted);
    todos.map(todo => {
      return handleTodoChange(todo.id, { completed: !isAllTodosCompleted });
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
