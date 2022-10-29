/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import {
  getTodos,
  deleteTodo,
  createTodo,
  updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [subtitleError, setSubtitleError] = useState('');
  const [title, setTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(0);
  const [isLoading, setisLoading] = useState<number[]>([]);

  enum Filter {
    Active = 'active',
    Completed = 'completed',
  }
  const activeItems = useMemo(() => {
    return (todos.filter(todo => !todo.completed)).length;
  }, [todos]);

  const loadTodos = async () => {
    try {
      if (user) {
        const getTodosFromServer = await getTodos(user.id);

        setTodos(getTodosFromServer);
      }
    } catch {
      setTimeout(() => {
        setHasError(true);
      }, 3000);
    }
  };

  // if (user) {
  //   getTodos(user.id)
  //     .then(response => {
  //       setTodos(response);
  //     })
  //     .catch(() => setTimeout(() => {
  //       setHasError(true);
  //     }, 3000));
  // }
  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Completed:
        return todo.completed;
      case Filter.Active:
        return !todo.completed;
      default:
        return todo;
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setHasError(true);
      setSubtitleError('Title can\'t be empty');

      return;
    }

    setisLoading([user?.id || 0]);

    try {
      if (user) {
        await createTodo(user.id, title);
      }
    } catch {
      setSubtitleError('Unable to add a todo');
    } finally {
      loadTodos();
    }

    setisLoading([]);
    setTitle('');
  };

  const handleRemove = useCallback(
    async (todoId: number) => {
      setisLoading(state => [...state, todoId]);
      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch {
        setHasError(true);
        setSubtitleError('Unable to delete a todo');
      }

      setisLoading([]);
    }, [],
  );

  const handleUpdate = async (todoId: number, data: Partial<Todo>) => {
    setisLoading(state => [...state, todoId]);

    await updateTodo(todoId, data).then((response) => {
      setTodos(todos.map(todo => (
        todo.id === todoId
          ? response
          : todo
      )));
    }).catch(() => {
      setSubtitleError('Unable to update a todo');
    });
    setisLoading([]);
  };

  const completedTodos = todos?.filter(todo => todo.completed);
  const activeToogle = todos.filter(todo => !todo.completed);

  const handlerRemoveComleted = () => {
    if (completedTodos) {
      completedTodos.forEach((todo) => {
        handleRemove(todo.id);
      });
    }
  };

  const handleToggal = async () => {
    const toggal = activeToogle.length === 0 ? completedTodos : activeToogle;

    toggal.forEach((todo) => {
      try {
        updateTodo(todo.id,
          { ...todo, completed: activeToogle.length !== 0 });
      } catch {
        setSubtitleError('Unable to update a todo');
      }
    });

    setTodos(todos.map(todo => {
      return { ...todo, completed: activeToogle.length !== 0 };
    }));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        newTodoField={newTodoField}
        title={title}
        setTitle={setTitle}
        handleSubmit={handleSubmit}
        handleToggal={handleToggal}
        todos={todos}
        completedTodos={completedTodos}
      />
      <div className="todoapp__content">
        {(todos.length > 0) && (
          <>
            <TodoList
              todos={visibleTodos}
              handleRemove={handleRemove}
              handleUpdate={handleUpdate}
              onSelectTodo={setSelectedTodo}
              selectedTodo={selectedTodo}
              selectedTodos={isLoading}
            />
            <Footer
              activeItems={activeItems}
              todos={visibleTodos}
              filterLink={filter}
              setFilter={setFilter}
              todosClear={completedTodos}
              handlerRemoveComleted={handlerRemoveComleted}
            />
          </>
        )}
      </div>
      {hasError && (
        <Notification
          error={hasError}
          SetError={setHasError}
          subtitleError={subtitleError}
        />
      )}

    </div>
  );
};
