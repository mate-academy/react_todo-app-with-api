/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import {
  addTodo,
  changeTodo,
  getTodos, removeTodo,
} from './api/todos';
import { AddTodoForm } from './components/AddTodoForm/AddTodoForm';
import { Loader } from './components/Loader/Loader';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getTodos(user.id)
        .then(setTodos)
        .finally(() => setIsLoading(false));
    }
  }, []);

  // eslint-disable-next-line no-console
  console.log(todos);

  const onAddTodo = (todo: Todo) => {
    setTodos((prevTodos) => (
      [...prevTodos, todo]
    ));
  };

  const handlerAddTodo = (title: string) => {
    if (user) {
      const newTodo = {
        userId: user.id,
        title,
        completed: false,
      };

      addTodo(newTodo)
        .then(addedTodo => onAddTodo(addedTodo));
    }
  };

  const onTodosUpdate = (changedTodo: Todo) => {
    const newTodoList = [...todos].map(todo => {
      if (todo.id === changedTodo.id) {
        return changedTodo;
      }

      return todo;
    });

    setTodos(newTodoList);
  };

  const handlerTodoStatusToggle = (id: number, status: boolean) => {
    setIsLoading(true);
    changeTodo(id, { completed: !status })
      .then(changedTodo => onTodosUpdate(changedTodo))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlerTodoTitleUpdate = (id: number, title: string) => {
    setIsLoading(true);
    changeTodo(id, { title })
      .then(changedTodo => onTodosUpdate(changedTodo))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDeleteTodo = (deletedTodoId: number) => {
    const newTodoList = [...todos].filter(todo => todo.id !== deletedTodoId);

    setTodos(newTodoList);
  };

  const handlerDeleteTodo = (todoId:number) => {
    setIsLoading(true);
    removeTodo(todoId)
      .then(() => onDeleteTodo(todoId))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <AddTodoForm addNewTodo={handlerAddTodo} />
        </header>

        {todos.length > 0 ? (
          <TodoList
            todos={todos}
            changeTodoStatus={handlerTodoStatusToggle}
            isLoading={isLoading}
            deleteTodo={handlerDeleteTodo}
            updateTitle={handlerTodoTitleUpdate}
          />
        ) : (
          <Loader />
        )}

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            4 items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className="filter__link selected"
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className="filter__link"
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className="filter__link"
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
          >
            Clear completed
          </button>
        </footer>
      </div>

      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />

        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
