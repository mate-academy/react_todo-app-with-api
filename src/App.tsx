/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { AuthProvider, AuthContext } from './components/Auth/AuthContext';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodoStatus,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorEnums } from './enums/ErrorEnums';
import { ErrorComponent } from './components/Error';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList';
import { FilterProvider } from './components/FilterContext';
import { TempTodo } from './components/TempTodo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState< Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [error, setError] = useState<ErrorEnums>(ErrorEnums.None);

  const loadTodos = async () => {
    if (user?.id) {
      let todosFromServer;

      try {
        todosFromServer = await getTodos(user.id);
      } catch {
        throw new Error('Todos not found');
      }

      setTodos(todosFromServer);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const addNewTodo = async (
    title: string,

  ) => {
    if (user && title.trim()) {
      setIsAdding(true);

      const getNewTodo = {
        userId: user.id,
        title: title.trim(),
        completed: false,
      };

      try {
        await addTodo(getNewTodo);
      } catch {
        setError(ErrorEnums.Add);
      }
    }

    await loadTodos();
    setNewTodoTitle('');
    setIsAdding(false);
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
    } catch {
      setError(ErrorEnums.Delete);
    }

    await loadTodos();
  };

  const deleteCompletedTodos = () => {
    const completedTodos = todos.filter(({ completed }) => completed);
    const completedTodoId = completedTodos.map(todo => todo.id);

    todos.map(todo => (
      completedTodoId.includes(todo.id)
        ? handleDeleteTodo(todo.id)
        : ''
    ));
  };

  const resetForm = () => {
    setNewTodoTitle('');
  };

  const onUpdateTodoStatus = async (
    todoId: number,
    completed: boolean,
  ): Promise<void> => {
    try {
      await updateTodoStatus(todoId, completed);
    } catch (e) {
      setError(ErrorEnums.Update);
    }
  };

  const handleUpdateAllTodoStatus = async () => {
    const completedAllTodos = todos.every(({ completed }) => completed);

    if (completedAllTodos) {
      todos.map(todo => onUpdateTodoStatus(todo.id, !todo.completed));
    }

    await loadTodos();
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle) {
      addNewTodo(newTodoTitle);
      resetForm();
    }
  };

  const allTodosCompleated = todos.every(todo => todo.completed === true);

  return (
    <AuthProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <FilterProvider>
          <div className="todoapp__content">
            <header className="todoapp__header">
              <button
                data-cy="ToggleAllButton"
                type="button"
                className={classNames(
                  'todoapp__toggle-all',
                  { active: allTodosCompleated },
                )}
                onClick={() => handleUpdateAllTodoStatus()}
              />

              <form onSubmit={handleFormSubmit}>
                <input
                  data-cy="NewTodoField"
                  type="text"
                  ref={newTodoField}
                  className="todoapp__new-todo"
                  placeholder="What needs to be done?"
                  value={newTodoTitle}
                  onChange={(event) => setNewTodoTitle(event.target.value)}
                />
              </form>
            </header>

            {isAdding && (
              <TempTodo title={newTodoTitle} />
            )}

            <TodoList
              todos={todos}
              deleteTodo={handleDeleteTodo}
              onUpdateTodoStatus={onUpdateTodoStatus}
              loadTodos={loadTodos}
            />

            {todos.length > 0 && (
              <Footer
                todos={todos}
                deleteCompletedTodos={deleteCompletedTodos}
              />
            )}
          </div>
        </FilterProvider>
        <ErrorComponent
          error={error}
          setError={setError}
        />
      </div>
    </AuthProvider>
  );
};
