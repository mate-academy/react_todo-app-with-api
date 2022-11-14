/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import cn from 'classnames';
import {
  createTodos,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoComponent } from './components/Todo';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/Error';
import { Form } from './components/Form';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputTitle, setInputTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [isHidden, setIsHidden] = useState(true);
  const [isEditing, setIsEditing] = useState<Todo | null>(null);

  const editTitle = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      setIsEditing(null);
      setIsAllSelected(response.every(todo => !todo.completed));
    } catch (error) {
      setErrorMessage('Unable to load todos');
      setIsHidden(false);
    }
  }, []);

  const createTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputTitle) {
      setErrorMessage('Title can\'t be empty');
      setIsHidden(false);

      return;
    }

    if (user) {
      const newTodo = {
        id: 0,
        userId: user.id,
        title: inputTitle,
        completed: false,
      };

      setTempTodo(newTodo);

      try {
        await createTodos(newTodo);
        getTodosFromApi(user.id);
      } catch {
        setErrorMessage('Unable to add a todo');
        setIsHidden(false);
        setTempTodo(null);
      }

      setInputTitle('');
    }
  };

  const setTodoSelected = useCallback(async (todo: Todo) => {
    try {
      await updateTodo(todo, !todo.completed);

      if (user) {
        getTodosFromApi(user.id);
      }
    } catch {
      setErrorMessage('Unable to update a todo');
      setIsHidden(false);
    }
  }, []);

  const selectAll = () => {
    const todoFunctions = todos.map(async (todo) => {
      if ((!todo.completed && isAllSelected)
        || (todo.completed && !isAllSelected)) {
        try {
          await updateTodo(todo, !todo.completed);
        } catch {
          setErrorMessage('Unable to update a todo');
          setIsHidden(false);
        }
      }
    });

    Promise.all(todoFunctions).then(() => {
      if (user) {
        getTodosFromApi(user.id);
      }
    });
  };

  const clearCompleted = () => {
    todos.map(async todo => {
      if (todo.completed) {
        removeTodo(todo);
        try {
          await removeTodo(todo);
        } catch {
          setErrorMessage('Unable to delete a todo');
          setIsHidden(false);
        }

        if (user) {
          getTodosFromApi(user.id);
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
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      default:
        return todo;
    }
  });

  const clearErrors = () => {
    setIsHidden(true);
    setErrorMessage('');
  };

  useEffect(() => {
    setTimeout(clearErrors, 3000);
  }, [isHidden]);

  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={cn('todoapp__toggle-all', { active: isAllCompleted })}
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
              setIsHidden={setIsHidden}
              isEditting={isEditing}
              setIsEditting={setIsEditing}
              setTodoSelected={setTodoSelected}
            />
          ))}

          {tempTodo && (
            <TodoComponent
              todo={tempTodo}
              getTodo={getTodosFromApi}
              setErrorMessage={setErrorMessage}
              editTitle={editTitle}
              setIsHidden={setIsHidden}
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

      <ErrorMessage
        isHidden={isHidden}
        clearErrors={clearErrors}
        errorMessage={errorMessage}
      />
    </div>
  );
};
