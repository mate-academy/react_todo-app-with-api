/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoElement } from './components/TodoElement';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { filterTodos, Filter, setCompleted } from './helpers/filterTodos';

import { Todo } from './types/Todo';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterOption, setFilterOption] = useState<Filter>(Filter.all);
  const [processingTodo, setProcessingTodo] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleError = () => {
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage('Unable to load a todos');
          handleError();
        });
    }
  }, []);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const completeTodosCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterOption);
  }, [todos, filterOption]);

  const createTodoClick = useCallback(
    (title: string) => {
      if (!title) {
        setErrorMessage('Title can\'t be empty');

        return;
      }

      if (user) {
        setTempTodo({
          id: 0,
          title,
          completed: false,
          userId: user.id,
        });

        createTodo(title, user.id)
          .then(newTodo => {
            setTodos(prev => [...prev, {
              id: newTodo.id,
              userId: newTodo.userId,
              title: newTodo.title,
              completed: newTodo.completed,
            }]);
          })
          .catch(() => setErrorMessage('Unable to add a todo'))
          .finally(() => {
            setTempTodo(null);
          });
      }
    },
    [user],
  );

  const deleteTodoClick = useCallback(
    (id: number) => {
      setProcessingTodo([id]);

      deleteTodo(id)
        .then(() => (
          setTodos(currentTodos => currentTodos
            .filter(todo => todo.id !== id))
        ))
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        })
        .finally(() => setProcessingTodo([]));
    },
    [],
  );

  const deleteTodoCompleted = useCallback(
    () => {
      const completedTodoId = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setProcessingTodo(completedTodoId);

      const deletePromises = todos.map(todo => {
        if (todo.completed) {
          return deleteTodo(todo.id)
            .then(() => setTodos(prev => prev
              .filter(prevTodo => !completedTodoId.includes(prevTodo.id))));
        }

        return Promise.resolve();
      });

      Promise.all(deletePromises)
        .finally(() => setProcessingTodo([]));
    },
    [todos],
  );

  const toggleTodoStatus = useCallback(async (id: number, status: boolean) => {
    setProcessingTodo([id]);

    try {
      await updateTodo(id, { completed: status });
      setTodos(prev => prev.map(todo => {
        return todo.id === id
          ? { ...todo, completed: status }
          : todo;
      }));
    } catch (e) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodo([0]);
    }
  }, []);

  const toggleAll = async () => {
    const completedTodoId = todos
      .filter(todo => todo.completed === isAdding)
      .map(todo => todo.id);

    setProcessingTodo(completedTodoId);

    try {
      await Promise.all(todos.map(todo => (
        updateTodo(todo.id, { completed: !isAdding })
      )));

      setTodos(todos.map(todo => ({ ...todo, completed: !isAdding })));
      setIsAdding(prev => !prev);
    } catch (e) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodo([0]);
    }
  };

  const updateTodoStatus = useCallback(async (todoToUpdate: Todo) => {
    try {
      const { id, ...fieldsToUpdate } = todoToUpdate;

      setProcessingTodo([id]);

      const updatedTodoNew = await updateTodo(id, fieldsToUpdate);

      setTodos(currentTodos => currentTodos.map(todo => (
        todo.id === updatedTodoNew.id ? updatedTodoNew : todo
      )));
    } catch (e) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodo([0]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage('Unable to load a todos');
        });
    }
  }, [user]);

  useEffect(() => setIsAdding(setCompleted(todos)), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader
          newTodoField={newTodoField}
          createTodo={createTodoClick}
          toglleAll={toggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              handleDeleteClick={deleteTodoClick}
              processingTodo={processingTodo}
              updateTodo={updateTodoStatus}
              toggleTodoStatus={toggleTodoStatus}
            />

            {tempTodo && (
              <TodoElement
                todo={tempTodo}
                handleDeleteClick={deleteTodoClick}
                processingTodo={processingTodo}
                updateTodo={updateTodoStatus}
                toggleTodoStatus={toggleTodoStatus}
              />
            )}

            <TodoFooter
              activeTodos={activeTodos}
              completeTodosCount={completeTodosCount}
              filterOption={filterOption}
              setFilterOption={setFilterOption}
              clearCompleted={deleteTodoCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          error={errorMessage}
          onChangeError={setErrorMessage}
        />
      )}
    </div>
  );
};
