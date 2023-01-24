import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  addTodos,
  changeTodo,
  deleteTodo,
  getTodos,
} from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { LoadedUser } from './todoContext';
import { TodosLength } from './TodosLength';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filterType, setFilterType] = useState(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadedUser, setLoadedUser] = useState(false);

  const clearTitle = () => {
    setTitle('');
  };

  const handleChangeTodo = useCallback(
    (todoId: number, params: any) => {
      changeTodo(todoId, params)
        .then((updatedTodo) => {
          setTodos(prev => prev.map(todo => {
            return updatedTodo.id !== todo.id
              ? todo
              : {
                id: updatedTodo.id,
                userId: updatedTodo.userId,
                title: updatedTodo.title,
                completed: updatedTodo.completed,
              };
          }));
        });
    }, [],
  );

  const handleDeleteItem = useCallback(
    async (todoId: number) => {
      deleteTodo(todoId)
        .then(() => (
          setTodos(currentTodos => currentTodos
            .filter(todo => todo.id !== todoId))
        ))
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        });
    }, [],
  );

  const handleItemsLeft = useCallback(
    () => {
      return todos.filter(todo => !todo.completed).length;
    }, [todos],
  );

  const handleAddTodo = useCallback(
    async () => {
      setLoadedUser(true);

      if (title) {
        const todo = await addTodos(title, user?.id, false);

        setTodos(prev => [...prev, todo]);

        clearTitle();
      }

      if (!title) {
        setErrorMessage('Title can\'t be empty');
      }

      setLoadedUser(false);
    }, [user?.id, title],
  );

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterType === Filter.ACTIVE) {
        return !todo.completed;
      }

      if (filterType === Filter.COMPLITED) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filterType]);

  const handleClickMessage = () => {
    setErrorMessage('');
  };

  const handleFilterType = useCallback((value: Filter) => {
    setFilterType(value);
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(result => {
          setTodos(result);
        })
        .catch(() => {
          setErrorMessage('Todos not found');
        });
    }
  }, [user]);

  const handleClearCompleted = useCallback(
    () => {
      setTodos(prev => {
        return prev.filter(todo => {
          if (todo.completed) {
            handleDeleteItem(todo.id);

            return false;
          }

          return true;
        });
      });
    }, [handleDeleteItem],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          title={title}
          setTitle={setTitle}
          onAddTodo={handleAddTodo}
        />

        {visibleTodos && (
          <LoadedUser.Provider value={isLoadedUser}>
            <TodoList
              todos={visibleTodos}
              onDeleteItem={handleDeleteItem}
              handleChangeTodo={handleChangeTodo}
            />
          </LoadedUser.Provider>
        )}

        {!!todos.length && (
          <TodosLength.Provider value={handleItemsLeft()}>
            <Footer
              onSelectFilter={handleFilterType}
              filterType={filterType}
              onClearCompleted={handleClearCompleted}
            />
          </TodosLength.Provider>
        )}
      </div>

      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onCloseError={handleClickMessage}
        />
      )}
    </div>
  );
};
