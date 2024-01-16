import {
  FC, useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 12121;

export const AppContainer: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(Filters.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editQuery, setEditQuery] = useState('');
  const [editQueryPrev, setEditQueryPrev] = useState('');

  const handleErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const closeError = () => {
    setErrorMessage('');
  };

  const loadTodos = useCallback(async () => {
    try {
      const loadedTodos = await getTodos(USER_ID);

      setTodos(loadedTodos);
      setIsPageLoading(true);
    } catch {
      handleErrorMessage(ErrorMessage.loadTodo);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const visibleTodos = (filterBy: Filters) => {
    if (!todos) {
      return todos;
    }

    switch (filterBy) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const handleFormSubmit = async (e?: Event) => {
    e?.preventDefault();
    if (!query.trim().length) {
      handleErrorMessage(ErrorMessage.titleEmpty);

      return;
    }

    try {
      const newTodo = {
        userId: USER_ID,
        title: query.trim(),
        completed: false,
        id: 0,
      };

      setTempTodo({ ...newTodo, id: 0 });
      setIsPageLoading(false);

      const newTodos = await addTodo('/todos', newTodo);

      setTodos(state => {
        return [...state, newTodos as Todo];
      });

      setTempTodo(null);
      setIsPageLoading(true);
      setQuery('');
    } catch {
      handleErrorMessage(ErrorMessage.addTodo);
      setTempTodo(null);
      setIsPageLoading(true);
    }
  };

  const handleComplete = async (id: number, completed: boolean) => {
    try {
      setIsUpdatingId((state) => [...state, id]);

      const todoToComplete = todos.find((todo) => todo.id === id);

      if (todoToComplete) {
        const updatedData: Todo = {
          id,
          userId: USER_ID,
          title: todoToComplete.title, // Use the existing title instead of query.trim()
          completed: !completed,
        };

        await updateTodo(id, updatedData);

        setTodos((state) => state.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              completed: !completed,
            };
          }

          return todo;
        }));

        setIsUpdatingId((state) => state.filter((stateId) => stateId !== id));
      }
    } catch {
      handleErrorMessage(ErrorMessage.updateTodo);
      setIsUpdatingId((state) => state.filter((stateId) => stateId !== id));
    }
  };

  const toggleAll = async () => {
    const isStatus = todos.every((todo) => todo.completed);

    try {
      const updatedTodos = await Promise.all(
        todos.map(async (todo) => {
          if ((isStatus && todo.completed) || (!isStatus && !todo.completed)) {
            setIsUpdatingId((state) => [...state, todo.id]);
            const updatedData: Todo = {
              id: todo.id,
              userId: USER_ID,
              title: query.trim(),
              completed: !isStatus,
            };

            await updateTodo(todo.id, updatedData);

            return { ...todo, completed: !isStatus };
          }

          return todo;
        }),
      );

      setTodos(updatedTodos);
      setIsUpdatingId([]);
    } catch {
      handleErrorMessage(ErrorMessage.updateTodo);
      setIsUpdatingId([]);
    }
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
        handleErrorMessage(ErrorMessage.deleteTodo);
        setIsUpdatingId((state) => (
          [...state.filter(stateId => stateId !== id)]
        ));
      }
    } else {
      setTodos(stateMain => {
        stateMain.forEach(async (todo) => {
          try {
            if (todo.completed) {
              setIsUpdatingId(state => (
                [...state, todo.id]
              ));
              await deleteTodo(todo.id);
              setTodos((state) => {
                return state.filter(todoF => todoF.id !== todo.id);
              });
              setIsUpdatingId((state) => (
                state.filter(stateId => stateId !== todo.id)
              ));
            }
          } catch {
            handleErrorMessage(ErrorMessage.deleteTodo);
            setIsUpdatingId([]);
          }
        });

        return stateMain;
      });
    }
  };

  const ecsKeyCancel = (e: string) => {
    if (e !== 'Escape') {
      return;
    }

    setEditQuery(editQueryPrev);
    setIsEditing(null);
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

      setIsUpdatingId((state) => [...state, id]);
      const updatedData: Todo = {
        id,
        userId: 1,
        title: queryEdit.trim(),
        completed: false,
      };

      await updateTodo(id, updatedData);
      setTodos((stateMain) => stateMain.map((todo) => {
        if (todo.id === id) {
          return { ...todo, title: queryEdit.trim() };
        }

        return todo;
      }));
      setIsUpdatingId((state) => [
        ...state.filter((stateId) => stateId !== id),
      ]);
      setIsEditing(null);
    } catch {
      handleErrorMessage(ErrorMessage.updateTodo);
      setIsUpdatingId((state) => [
        ...state.filter((stateId) => stateId !== id),
      ]);
    }
  };

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const uncompletedTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

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
          isPageLoaded={isPageLoading}
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

        {!!todos.length && (
          <Footer
            filter={setFilter}
            filterValue={filter}
            completedTodos={completedTodos}
            uncompletedTodos={uncompletedTodos}
            handleDelete={handleDelete}
          />
        )}
      </div>
      <Error errorMessage={errorMessage} closeErrorMessage={closeError} />
    </div>
  );
};
