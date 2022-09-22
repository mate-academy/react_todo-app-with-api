/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useContext, useEffect,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { getTodos, deleteTodo, patchTodo } from './api/todos';
import { ErrorNotification } from './components/Notification/ErrorNotification';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoItem } from './components/Section/TodoItem';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(0);
  const [filter, setFilter] = useState(Filter.all);
  const [isError, setIsError] = useState(false);
  const [errorTitle, setErroTitle] = useState('');

  const completedTodos = todos?.filter(todo => todo.completed);

  const showError = (text: string) => {
    setIsError(true);
    setErroTitle(text);

    setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        if (user) {
          const result = await getTodos(user.id);

          setTodos(result);
        }
      } catch {
        showError('Unable to load todos');
      }
    };

    loadTodos();
  }, [user]);

  const removeTodo = async (todoId: number) => {
    try {
      setLoadingTodosId(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      if (user) {
        const result = await getTodos(user.id);

        setTodos(result);
      }

      setLoadingTodosId(prev => prev.filter(id => id !== todoId));
    } catch {
      showError('Unable to delete a todo');
    }
  };

  const updateTodo = async (todoId: number, data: Partial<Todo>) => {
    try {
      setLoadingTodosId(prev => [...prev, todoId]);

      await patchTodo(todoId, data);

      if (user) {
        const result = await getTodos(user.id);

        setTodos(result);
      }

      setLoadingTodosId(prev => prev.filter(id => id !== todoId));
    } catch {
      showError('Unable to update a todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          user={user}
          todos={todos}
          setTodos={setTodos}
          title={title}
          setTitle={setTitle}
          setLoadingTodosId={setLoadingTodosId}
          showError={showError}
          completedTodos={completedTodos}
        />

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  editedTitle={editedTitle}
                  setEditedTitle={setEditedTitle}
                  title={title}
                  setEditingTodoId={setEditingTodoId}
                  editingTodoId={editingTodoId}
                  removeTodo={removeTodo}
                  updateTodo={updateTodo}
                  loadingTodosId={loadingTodosId}
                  filter={filter}
                />
              ))}
            </section>

            <Footer
              todos={todos}
              completedTodos={completedTodos}
              filter={filter}
              setFilter={setFilter}
              removeTodo={removeTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification
        isError={isError}
        errorTitle={errorTitle}
        setIsError={setIsError}
      />
    </div>
  );
};
