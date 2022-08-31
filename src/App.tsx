/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useCallback,
  useContext,
  useEffect, useMemo,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/Todo/ToodList';
import { NewTodo, Todo } from './types/Todo';
import { Footer } from './components/Footer/footer';
import {addTodos, getTodos, updateTodos} from './api/todos';
import { InputForm } from './components/Header/addForm';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (user !== null) {
      setIsLoading(true);
      getTodos(user.id)
        .then(todosFromServer => setTodos(todosFromServer));
    }
  }, []);

  const TodoOnPage = useCallback((newTodo:Todo) => {
    setTodos(prevTodos => {
      return (
        [newTodo, ...prevTodos]
      );
    });
  }, [todos]);

  const findTodoById = (todoId:number) => {
    return todos.find(todo => (todo.id === todoId));
  };

  const handlerOnSubmit = (event:FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (user && todoTitle) {
      const newTodo:NewTodo = {
        userId: user.id,
        title: todoTitle,
        completed: false,
      };

      addTodos(newTodo)
        .then(addedTodo => TodoOnPage(addedTodo))
        .then(() => setIsLoading(true))
        .catch(() => setHasError(true))
        .finally(() => setIsLoading(false));
    }
  };

  const handlerCheckBox = (todo:Todo) => {
    const selectedTodo = findTodoById(todo.id);

    if (typeof selectedTodo !== 'undefined') {
      selectedTodo.completed = !selectedTodo.completed;

      updateTodos(selectedTodo.id, selectedTodo.completed)
        .then(() => setIsLoading(true));
    }
  };

  const filteredToDo = useMemo(() => (
    todos.filter(todo => {
      const queryFilter = todo.title.toLowerCase().includes(
        searchQuery.toLowerCase(),
      );

      switch (completedFilter) {
        case FilterBy.ACTIVE:
          return queryFilter && !todo.completed;

        case FilterBy.COMPLETED:
          return queryFilter && todo.completed;

        default:
          return queryFilter;
      }
    })
  ), [searchQuery, todos, completedFilter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <InputForm
          handlerSubmit={handlerOnSubmit}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
        />
        <TodoList
          todos={todos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          handlerCheckBox={handlerCheckBox}
        />
        <Footer todos={todos} filteredTodo={filteredToDo}  />
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
