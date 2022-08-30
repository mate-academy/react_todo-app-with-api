/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/Todo/ToodList';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer/footer';
import { addTodos, getTodos } from './api/todos';
import {InputForm} from "./components/Header/addForm";

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user !== null) {
      setIsLoading(true);
      getTodos(user.id)
        .then(todosFromServer => setTodos(todosFromServer));
    }
  }, []);

  const handlerOnSubmit = (event:FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    addTodos()
      .then()
      .catch()
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <InputForm
          handler={handlerOnSubmit}

        />
        <TodoList
          todos={todos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}

        />
        <Footer />
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
