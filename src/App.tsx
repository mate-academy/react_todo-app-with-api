import React, {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './components/Filter';
import { NewTodo } from './components/NewTodo';
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
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.none);
  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoadingList, setisLoadingList] = useState<number[]>([]);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const todos = await getTodos(user.id);

          setUserTodos(todos);
        } catch (err) {
          setErrorMessage(ErrorMessage.load);
        }
      })();
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

  const addNewTodo = useCallback(() => {
    const title = query.trim();

    if (!title.length) {
      setErrorMessage(ErrorMessage.emptyTitle);

      return;
    }

    if (user) {
      const newTodo = {
        userId: user.id,
        title,
        completed: false,
      };

      setIsAdding(sortType !== SortType.completed);

      (async () => {
        try {
          const todo = await addTodo(newTodo);

          setUserTodos(prev => [...prev, todo]);
          setQuery('');
        } catch (err) {
          setErrorMessage(ErrorMessage.add);
        } finally {
          setIsAdding(false);
        }
      })();
    }
  }, [query]);

  const removeTodo = useCallback((todoId: number) => {
    setisLoadingList(prev => [...prev, todoId]);

    (async () => {
      try {
        await deleteTodo(todoId);

        setUserTodos(prev => prev.filter(todo => todo.id !== todoId));
        setQuery('');
      } catch (err) {
        setErrorMessage(ErrorMessage.delete);
      } finally {
        setisLoadingList([]);
      }
    })();
  }, []);

  const removeCompletedTodos = useCallback(() => {
    userTodos.forEach(({ id, completed }) => {
      if (completed) {
        removeTodo(id);
      }
    });
  }, [userTodos]);

  const updatingTodo = useCallback((todo: Todo, title?: string) => {
    const updatedTodo = {
      ...todo,
      completed: title ? todo.completed : !todo.completed,
      title: title || todo.title,
    };

    (async () => {
      try {
        await updateTodo(updatedTodo);

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
      } catch (err) {
        setErrorMessage(ErrorMessage.update);
      } finally {
        setisLoadingList([]);
      }
    })();
  }, []);

  const updateStatus = useCallback((todo: Todo) => {
    setisLoadingList(prev => [...prev, todo.id]);
    updatingTodo(todo);
  }, [userTodos]);

  const updateStatusForAll = useCallback((hasActive: boolean) => {
    userTodos.forEach(todo => {
      if (!hasActive) {
        updateStatus(todo);
      }

      if (!todo.completed) {
        updateStatus(todo);
      }
    });
  }, [userTodos]);

  const resetEditTodoId = useCallback(() => {
    setEditTodoId(null);
  }, []);

  const updateTitle = useCallback((todo: Todo, cancel?: boolean) => {
    const title = newTitle.trim();

    if (title === todo.title || cancel) {
      resetEditTodoId();
      setNewTitle('');

      return;
    }

    if (title.length) {
      setisLoadingList(prev => [...prev, todo.id]);
      resetEditTodoId();

      updatingTodo(todo, title);
    } else {
      removeTodo(todo.id);
    }
  }, [newTitle]);

  const isUserTodos = useMemo(() => Boolean(userTodos.length), [userTodos]);
  const activeTodosCount = useMemo(() => (
    getActiveTodos(userTodos).length),
  [userTodos]);
  const completedTodosCount = useMemo(() => (
    getCompletedTodos(userTodos).length),
  [userTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
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

        {isUserTodos
        && (
          <Filter
            sortType={sortType}
            onSortType={setSortType}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            onRemoveCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>

      {errorMessage !== ErrorMessage.none
      && (
        <ErrorNotification
          onErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
