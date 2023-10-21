/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Error } from './components/Error';
import { ErrMessage, FilterBy } from './types/Enums';

const USER_ID = 11701;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(FilterBy.all);
  const [errorWarning, setErrorWarning] = useState('');
  const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editQuery, setEditQuery] = useState('');
  const [editQueryPrev, setEditQueryPrev] = useState('');

  const handleErrorSet = (errMessage: string) => {
    setErrorWarning(errMessage);
    setTimeout(() => {
      setErrorWarning('');
    }, 3000);
  };

  const closeError = () => {
    setErrorWarning('');
  };

  const loadTodos = useCallback(async () => {
    try {
      const loadedTodos = await getTodos(USER_ID);

      setTodos(loadedTodos);
      setPageIsLoaded(true);
    } catch {
      handleErrorSet(ErrMessage.loadTodo);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const visibleTodos = (filterBy: FilterBy) => {
    if (todos) {
      switch (filterBy) {
        case FilterBy.all:
          return todos;
        case FilterBy.active:
          return todos.filter(todo => (
            !todo.completed
          ));
        case FilterBy.completed:
          return todos.filter(todo => (
            todo.completed
          ));
        default: return todos;
      }
    }

    return todos;
  };

  const handleFormSubmit = async (e?: Event) => {
    e?.preventDefault();
    if (!query.trim().length) {
      handleErrorSet(ErrMessage.titleEmpty);

      return;
    }

    try {
      const newTodo = {
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });
      setPageIsLoaded(false);

      const newTodos = await addTodo('/todos', newTodo);

      setTodos(state => {
        return [...state, newTodos as Todo];
      });

      setTempTodo(null);
      setPageIsLoaded(true);
      setQuery('');
    } catch {
      handleErrorSet(ErrMessage.addTodo);
      setTempTodo(null);
      setPageIsLoaded(true);
    }
  };

  const handleComplete = async (id: number, completed: boolean) => {
    try {
      setIsUpdatingId(state => (
        [...state, id]
      ));
      await updateTodo(id, { completed: !completed });
      setTodos(state => {
        state.map(todo => {
          if (todo.id === id) {
            // eslint-disable-next-line no-param-reassign
            todo.completed = !completed;
          }

          return todo;
        });

        return [...state];
      });
      setIsUpdatingId((state) => (
        [...state.filter(stateId => stateId !== id)]
      ));
    } catch {
      handleErrorSet(ErrMessage.updateTodo);
      setIsUpdatingId((state) => (
        [...state.filter(stateId => stateId !== id)]
      ));
    }
  };

  const toggleAll = () => {
    const isStatus = todos.every(todo => todo.completed);

    setTodos(stateMain => {
      stateMain.map(async (todo) => {
        try {
          if (isStatus && todo.completed) {
            setIsUpdatingId(state => (
              [...state, todo.id]
            ));
            await updateTodo(todo.id, { completed: false });
            // eslint-disable-next-line no-param-reassign
            todo.completed = false;
            setIsUpdatingId([]);

            return [...stateMain];
          }

          if (!todo.completed) {
            setIsUpdatingId(state => (
              [...state, todo.id]
            ));
            await updateTodo(todo.id, { completed: true });
            // eslint-disable-next-line no-param-reassign
            todo.completed = true;
            setIsUpdatingId([]);

            return [...stateMain];
          }

          return [...stateMain];
        } catch {
          handleErrorSet(ErrMessage.updateTodo);
          setIsUpdatingId([]);
        }

        return [...stateMain];
      });

      return [...stateMain];
    });

    setTodos(state => [...state]);
  };

  const handleDelete = async (id?: number) => {
    if (id) {
      try {
        setIsUpdatingId(state => (
          [...state, id]
        ));
        await deleteTodo(id);
        setTodos((state) => {
          return [...state.filter(todo => todo.id !== id)];
        });
        setIsUpdatingId((state) => (
          [...state.filter(stateId => stateId !== id)]
        ));
      } catch {
        handleErrorSet(ErrMessage.deleteTodo);
        setIsUpdatingId((state) => (
          [...state.filter(stateId => stateId !== id)]
        ));
      }
    } else {
      setTodos(stateMain => {
        stateMain.forEach(async (todo) => {
          try {
            if (todo.completed === true) {
              setIsUpdatingId(state => (
                [...state, todo.id]
              ));
              await deleteTodo(todo.id);
              setTodos((state) => {
                return [...state.filter(todoF => todoF.id !== todo.id)];
              });
              setIsUpdatingId((state) => (
                [...state.filter(stateId => stateId !== todo.id)]
              ));
            }
          } catch {
            handleErrorSet(ErrMessage.deleteTodo);
            setIsUpdatingId([]);
          }
        });

        return stateMain;
      });
    }
  };

  const ecsKeyCancel = (e: string) => {
    if (e === 'Escape') {
      setEditQuery(editQueryPrev);
      setIsEditing(null);
    }
  };

  const handleEdit = (id: number, title: string) => {
    document.addEventListener('keyup', event => {
      ecsKeyCancel(event.key);
    });

    setIsEditing(id);
    setEditQuery(title);
    setEditQueryPrev(title);
  };

  const handleEditSubmit = async (queryEdit: string, id: number) => {
    try {
      if (!queryEdit.trim()) {
        handleDelete(id);

        return;
      }

      if (editQueryPrev === queryEdit.trim()) {
        setIsEditing(null);

        return;
      }

      setIsUpdatingId(state => (
        [...state, id]
      ));
      await updateTodo(id, { title: queryEdit.trim() });
      setTodos(stateMain => {
        stateMain.map(todo => {
          if (todo.id === id) {
            // eslint-disable-next-line no-param-reassign
            todo.title = queryEdit.trim();
          }

          return todo;
        });

        return stateMain;
      });
      setIsUpdatingId((state) => (
        [...state.filter(stateId => stateId !== id)]
      ));
      setIsEditing(null);
    } catch {
      handleErrorSet(ErrMessage.updateTodo);
      setIsUpdatingId((state) => (
        [...state.filter(stateId => stateId !== id)]
      ));
    }
  };

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos, isUpdatingId]);

  const uncompletedTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos, isUpdatingId]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          handleFormSubmit={handleFormSubmit}
          query={query}
          setQuery={setQuery}
          uncompletedTodos={uncompletedTodos}
          toggleAll={toggleAll}
          pageIsLoaded={pageIsLoaded}
        />
        {todos && (
          <TodoList
            todos={visibleTodos(filter)}
            handleComplete={handleComplete}
            handleDelete={handleDelete}
            isUpdatingId={isUpdatingId}
            isEditing={isEditing}
            handleEdit={handleEdit}
            query={editQuery}
            setQuery={setEditQuery}
            handleEditSubmit={handleEditSubmit}
            tempTodo={tempTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            filter={setFilter}
            filterValue={filter}
            completedTodos={completedTodos}
            uncompletedTodos={uncompletedTodos}
            handleMultipleDelete={handleDelete}
          />
        )}
      </div>
      <Error error={errorWarning} closeError={closeError} />
    </div>
  );
};
