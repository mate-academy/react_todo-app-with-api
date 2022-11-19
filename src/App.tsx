import React, {
  useContext, useEffect, useRef, useState, useCallback,
} from 'react';
import cn from 'classnames';
import {
  createTodos, getTodos, removeTodo, updateTodo,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoComponent } from './components/Todo';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { Form } from './components/Form';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputTitle, setInputTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [edittingTodo, setEdittingTodo] = useState<Todo | null>(null);

  const editTitle = useRef<HTMLInputElement>(null);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const getTodosFromApi = useCallback(async (userId: number) => {
    try {
      const response = await getTodos(userId);

      setTodos(response);
      setTempTodo(null);
      setEdittingTodo(null);
      setIsAllSelected(response.every(todo => !todo.completed));
    } catch {
      setErrorMessage('Unable to load todos');
    }
  }, []);

  const createTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (!user) {
        return;
      }

      if (!inputTitle.trim()) {
        setErrorMessage('Title can\'t be empty');

        return;
      }

      const newTodo = {
        id: 0,
        userId: user.id,
        title: inputTitle,
        completed: false,
      };

      setTempTodo(newTodo);
      await createTodos(newTodo);
      getTodosFromApi(user.id);
    } catch {
      setErrorMessage('Unable to add a todo');
      setTempTodo(null);
    }

    setInputTitle('');
  };

  const setTodoSelected = useCallback(async (todo: Todo) => {
    try {
      if (!user) {
        return;
      }

      await updateTodo(todo, !todo.completed);
      getTodosFromApi(user.id);
    } catch {
      setErrorMessage('Unable to update a todo');
    }
  }, []);

  const selectAll = () => {
    if (!user) {
      return;
    }

    const todoFunctions = todos.map(async (todo) => {
      if ((!todo.completed && isAllSelected)
        || (todo.completed && !isAllSelected)) {
        try {
          return await updateTodo(todo, !todo.completed);
        } catch {
          setErrorMessage('Unable to update a todo');
        }
      }

      return null;
    });

    Promise.all(todoFunctions).then(() => {
      getTodosFromApi(user.id);
    });
  };

  const clearCompleted = () => {
    if (!user) {
      return;
    }

    todos.forEach(async todo => {
      if (todo.completed) {
        try {
          await removeTodo(todo);
          getTodosFromApi(user.id);
        } catch {
          setErrorMessage('Unable to delete a todo');
        }
      }
    });
  };

  useEffect(() => {
    if (user) {
      getTodosFromApi(user.id);
    }
  }, [user]);

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return !todo.completed;
      case FilterType.COMPLETED:
        return todo.completed;
      default:
        return todo;
    }
  });

  const clearErrors = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    setTimeout(clearErrors, 3000);
  }, [errorMessage]);

  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="toggleButton"
            data-cy="ToggleAllButton"
            type="button"
            className={cn('todoapp__toggle-all', { active: isAllCompleted },
              { hidden: filteredTodos.length === 0 })}
            onClick={selectAll}
          />
          <Form
            createTodo={createTodo}
            newTodoField={newTodoField}
            inputTitle={inputTitle}
            setInputTitle={setInputTitle}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoComponent
              key={todo.id}
              todo={todo}
              getTodo={getTodosFromApi}
              setErrorMessage={setErrorMessage}
              editTitle={editTitle}
              edittingTodo={edittingTodo}
              setEdittingTodo={setEdittingTodo}
              setTodoSelected={setTodoSelected}
            />
          ))}

          {tempTodo && (
            <TodoComponent
              todo={tempTodo}
              getTodo={getTodosFromApi}
              setErrorMessage={setErrorMessage}
              editTitle={editTitle}
              setTodoSelected={setTodoSelected}
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {errorMessage.length > 0 && (
        <ErrorMessage
          clearErrors={clearErrors}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
