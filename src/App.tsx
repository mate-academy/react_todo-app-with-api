import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/Filter';
import { Todo } from './types/Todo';
import { ErrorTypes } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [errorMessage, setErrorMessage]
    = useState<string | null>(ErrorTypes.None);
  const [filterBy, setFilterBy] = useState<FilterTypes>(FilterTypes.All);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState({
    id: 0,
    userId: user?.id || 0,
    title: '',
    completed: false,
  });

  useEffect(() => {
    async function todosFromServer(userId: number) {
      try {
        const visibleTodos = getTodos(userId);

        setTodos(await visibleTodos);
      } catch {
        setErrorMessage(ErrorTypes.UnableLoad);
      }
    }

    if (!user) {
      return;
    }

    todosFromServer(user.id);
  }, []);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const filterTodos = useMemo(() => {
    return todos.filter(todoItem => {
      switch (filterBy) {
        case FilterTypes.All:
          return todoItem;

        case FilterTypes.Active:
          return !todoItem.completed;

        case FilterTypes.Completed:
          return todoItem.completed;

        default:
          return null;
      }
    });
  }, [todos, filterBy]);

  const onAddTodo = async (todoTitle: string) => {
    setIsAdding(true);
    setTempTodo(prev => ({ ...prev, title: todoTitle }));

    try {
      setTodos([...todos, await createTodo(user?.id || 0, todoTitle)]);
    } catch {
      setErrorMessage(ErrorTypes.UnableAdd);
    } finally {
      setIsAdding(false);
      setTempTodo(prev => ({ ...prev, title: '' }));
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
    } catch {
      setErrorMessage(ErrorTypes.UnableDelete);
    } finally {
      setIsDeleting(false);
    }
  };

  const removeCompletedTodos = async () => {
    setIsDeleting(true);
    try {
      completedTodos.forEach(({ id }) => removeTodo(id));
    } catch {
      setErrorMessage(ErrorTypes.UnableDelete);
    }
  };

  const onUpdateTodo = async (todo: Todo, newTitle?: string) => {
    const { id: todoId, title, completed } = todo;
    const currentTodo = todo;

    try {
      if (newTitle) {
        await updateTodo(todoId, newTitle, completed);
        currentTodo.title = newTitle;
      } else {
        await updateTodo(todoId, title, !completed);
        currentTodo.completed = !currentTodo.completed;
      }

      setTodos([...todos]);
    } catch {
      setErrorMessage(ErrorTypes.UnableUpdate);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleAllTodos = async () => {
    setIsUpdating(true);

    try {
      if (activeTodos.length !== 0) {
        activeTodos.forEach(todo => onUpdateTodo(todo));
      } else {
        completedTodos.forEach(todo => onUpdateTodo(todo));
      }
    } catch {
      setErrorMessage(ErrorTypes.UnableComplete);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          setErrorMessage={setErrorMessage}
          isAdding={isAdding}
          onAddTodo={onAddTodo}
          toggleAllTodos={toggleAllTodos}
          activeTodos={activeTodos}
        />

        {todos && (
          <div className="todoapp__content">
            <TodoList
              filterTodos={filterTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              isDeleting={isDeleting}
              onUpdateTodo={onUpdateTodo}
              isUpdating={isUpdating}
            />
            <Footer
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              removeCompletedTodos={removeCompletedTodos}
            />
          </div>
        )}
      </div>
      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
