/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
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
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(0);
  const [isLoading, setisLoading] = useState(false);

  enum Filter {
    Active = 'active',
    Completed = 'completed',
  }

  // if (!hasError) {
  //   setTimeout(() => {
  //     setHasError(true);
  //   }, 3000);
  // }

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(response => {
          setTodos(response);
          setIsAdding(true);
        })
        .catch(() => setTimeout(() => {
          setHasError(true);
        }, 3000));
    }
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setHasError(true);
      setSubtitleError('Title can\'t be empty');

      return;
    }

    setisLoading(true);

    if (user) {
      createTodo(user.id, title).then(newTodo => {
        setTodos([
          ...todos,
          newTodo,
        ]);
      }).catch(() => {
        setSubtitleError('Unable to add a todo');
      });
    }

    setIsAdding(false);
    setTitle('');
  };

  const handleRemove = useCallback(
    async (todoId: number) => {
      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch {
        setHasError(true);
        setSubtitleError('Unable to delete a todo');
      }
    }, [],
  );

  const handleUpdate = async (todoId: number, data: Partial<Todo>) => {
    setisLoading(true);
    await updateTodo(todoId, data).then((response) => {
      setTodos(todos.map(todo => (
        todo.id === todoId
          ? response
          : todo
      )));
    }).catch(() => {
      setSubtitleError('Unable to update a todo');
    });
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
        {(isAdding || todos.length > 0) && (
          <>
            <TodoList
              todos={visibleTodos}
              handleRemove={handleRemove}
              isLoading={isLoading}
              handleUpdate={handleUpdate}
              onSelectTodo={setSelectedTodo}
              selectedTodo={selectedTodo}
            />
            <Footer
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
