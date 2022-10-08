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
import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';
import { getActiveTodos, getCompletedTodos } from './utils/filtering';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.all);
  const [errorMessage, setErrrorMessage]
    = useState<ErrorMessage>(ErrorMessage.none);
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
        .catch(() => setErrrorMessage(ErrorMessage.load));
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
    if (errorMessage !== ErrorMessage.none) {
      setTimeout(() => setErrrorMessage(ErrorMessage.none), 3000);
    }
  }, [errorMessage]);

  const addNewTodo = () => {
    const title = query.trim();

    if (!title.length) {
      setErrrorMessage(ErrorMessage.emptyTitle);

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
        .catch(() => setErrrorMessage(ErrorMessage.add))
        .finally(() => setIsAdding(false));
    }
  };

  const removeTodo = (todoId: number) => {
    setisLoadingList(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setUserTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrrorMessage(ErrorMessage.delete))
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

  const updatingTodo = (todo: Todo, title?: string) => {
    const updatedTodo = {
      ...todo,
      completed: title ? todo.completed : !todo.completed,
      title: title || todo.title,
    };

    updateTodo(updatedTodo)
      .then(() => {
        setUserTodos(prev => {
          const currentTodo = prev.find(todoItem => todoItem.id === todo.id);

          if (currentTodo) {
            if (title) {
              currentTodo.title = title;
            } else {
              currentTodo.completed = !currentTodo.completed;
            }
          }

          return [...prev];
        });
      })
      .catch(() => setErrrorMessage(ErrorMessage.update))
      .finally(() => setisLoadingList([]));
  };

  const updateStatus = (todo: Todo) => {
    setisLoadingList(prev => [...prev, todo.id]);
    updatingTodo(todo);
  };

  const updateStatusForAll = (hasActive: boolean) => {
    userTodos.forEach(todo => {
      if (!hasActive) {
        updateStatus(todo);
      }

      if (!todo.completed) {
        updateStatus(todo);
      }
    });
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

      updatingTodo(todo, title);
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

      {errorMessage !== ErrorMessage.none
      && (
        <ErrorNotification
          onErrorMessage={setErrrorMessage}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
