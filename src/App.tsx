import React, { useContext, useEffect, useState } from 'react';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { SortType } from './types/SortType';
import { ErrorType } from './types/ErrorType';
import { Todo } from './types/Todo';
import { getActiveTodos, getCompletedTodos } from './utils/filtering';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.all);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.none);
  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoadingList, setisLoadingList] = useState<number[]>([]);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then((todos: Todo[]) => {
          setUserTodos(todos);
        })
        .catch(() => setErrorType(ErrorType.load));
    }
  }, []);

  useEffect(() => {
    switch (sortType) {
      case SortType.completed:
        setVisibleTodos(getCompletedTodos(userTodos));
        break;

      case SortType.active:
        setVisibleTodos(getActiveTodos(userTodos));
        break;

      case SortType.all:
        setVisibleTodos(userTodos);
        break;

      default: throw new Error('Unknown sort type');
    }
  }, [sortType, userTodos]);

  useEffect(() => {
    if (errorType !== ErrorType.none) {
      setTimeout(() => setErrorType(ErrorType.none), 3000);
    }
  }, [errorType]);

  const addNewTodo = () => {
    const title = query.trim();

    if (!title.length) {
      setErrorType(ErrorType.emptyTitle);

      return;
    }

    if (user) {
      const newTodo = {
        userId: user.id,
        title,
        completed: false,
      };

      setIsAdding(sortType !== SortType.completed);

      addTodo(newTodo)
        .then((todo: Todo) => {
          setUserTodos(prev => [...prev, todo]);
          setQuery('');
        })
        .catch(() => setErrorType(ErrorType.add))
        .finally(() => setIsAdding(false));
    }
  };

  const removeTodo = (todoId: number) => {
    setisLoadingList(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setUserTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorType(ErrorType.delete))
      .finally(() => setisLoadingList([]));
  };

  const removeCompletedTodos = () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const { id, completed } of userTodos) {
      if (completed) {
        removeTodo(id);
      }
    }
  };

  const updateStatus = (todo: Todo) => {
    setisLoadingList(prev => [...prev, todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(() => {
        setUserTodos(prev => {
          const currentTodo = prev.find(todoItem => todoItem.id === todo.id);

          if (currentTodo) {
            currentTodo.completed = !currentTodo.completed;
          }

          return [...prev];
        });
      })
      .catch(() => setErrorType(ErrorType.update))
      .finally(() => setisLoadingList([]));
  };

  const updateStatusForAll = (hasActive: boolean) => {
    if (hasActive) {
    // eslint-disable-next-line no-restricted-syntax
      for (const todo of userTodos) {
        if (!todo.completed) {
          updateStatus(todo);
        }
      }
    } else {
    // eslint-disable-next-line no-restricted-syntax
      for (const todo of userTodos) {
        updateStatus(todo);
      }
    }
  };

  const resetEditTodoId = () => {
    setEditTodoId(null);
  };

  const updateTitle = (todo: Todo, cancel?: boolean) => {
    const title = newTitle.trim();

    if (title === todo.title || cancel) {
      resetEditTodoId();

      return;
    }

    if (title.length) {
      setisLoadingList(prev => [...prev, todo.id]);
      resetEditTodoId();

      updateTodo({ ...todo, title })
        .then(() => {
          setUserTodos(prev => {
            const currentTodo = prev.find(todoItem => todoItem.id === todo.id);

            if (currentTodo) {
              currentTodo.title = title;
            }

            return [...prev];
          });
        })
        .catch(() => setErrorType(ErrorType.update))
        .finally(() => {
          setisLoadingList([]);
        });
    } else {
      removeTodo(todo.id);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isTodos={Boolean(userTodos.length)}
          query={query}
          onQueryChange={setQuery}
          onAddNewTodo={addNewTodo}
          isAdding={isAdding}
          hasActive={Boolean(getActiveTodos(userTodos).length)}
          onUpdateStatusForAll={updateStatusForAll}
        />

        <TodoList
          todos={visibleTodos}
          isAdding={isAdding}
          query={query}
          onRemoveTodo={removeTodo}
          isLoadingList={isLoadingList}
          onUpdateStatus={updateStatus}
          onSetEditTodoId={setEditTodoId}
          editTodoId={editTodoId}
          onSetNewTitle={setNewTitle}
          newTitle={newTitle}
          onUpdateTitle={updateTitle}
        />

        {Boolean(userTodos.length)
        && (
          <Footer
            sortType={sortType}
            onSortType={setSortType}
            activeTodosCount={getActiveTodos(userTodos).length}
            completedTodosCount={getCompletedTodos(userTodos).length}
            onRemoveCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>

      {errorType !== ErrorType.none
      && <ErrorNotification onErrorType={setErrorType} errorType={errorType} />}
    </div>
  );
};
