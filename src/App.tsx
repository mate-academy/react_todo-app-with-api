/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addTodos,
  deleteTodo,
  editTodo,
  getTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/footer';
import { Error } from './components/error';
import { Todo } from './types/Todo';

export const App: FC = () => {
  const user = useContext(AuthContext);
  const userId = user ? user.id : 0;
  // const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [noError, setNoError] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState([0]);
  const [
    temporaryTodo,
    setTemporaryTodo,
  ] = useState<Todo | null>(null);

  const showError = (errorTextToShow: string) => {
    setNoError(false);
    setErrorText(errorTextToShow);

    setTimeout(() => {
      setNoError(true);
      setErrorText('');
    }, 3000);
  };

  useEffect(() => {
    getTodos(userId)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        showError('Unable to update a todo');
      });
  }, []);

  const onTitleSubmit = useCallback((title: string) => {
    const trimedTitle = title.trim();

    if (trimedTitle.length === 0) {
      showError('Title can\'t be empty');

      return;
    }

    setTemporaryTodo({
      id: 0,
      userId,
      title: trimedTitle,
      completed: false,
    });

    setIsAdding(true);

    const newTodo = {
      userId,
      title: trimedTitle,
      completed: false,
    };

    addTodos(userId, newTodo)
      .then((newTodoFromServer) => {
        setTodos((currentTodos) => {
          return [...currentTodos, newTodoFromServer];
        });
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setTemporaryTodo(null);
        setIsAdding(false);
      });
  }, []);

  const onDelete = useCallback((id: number) => {
    setIsLoading((currentArrIsDelete) => [...currentArrIsDelete, id]);

    deleteTodo(id)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.filter(todo => todo.id !== id);
        });
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setIsLoading((currentArrIsDelete) => {
          return currentArrIsDelete
            .filter(idOfDeletingItem => idOfDeletingItem !== id);
        });
      });
  }, []);

  const onToggle = useCallback((id: number) => {
    setIsLoading((currentArrIsDelete) => [...currentArrIsDelete, id]);
    const todoToedit = todos.find(todo => todo.id === id);

    if (!todoToedit) {
      showError('Unable to update a todo');

      return;
    }

    const newData: Pick<Todo, 'completed'> = {
      completed: !todoToedit.completed,
    };

    editTodo(id, newData)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                ...newData,
              };
            }

            return todo;
          });
        });
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setIsLoading((areLoadingNow) => {
          return areLoadingNow
            .filter(idOfLoadedTodo => idOfLoadedTodo !== id);
        });
      });
  }, [todos]);

  const onToggleAll = useCallback(() => {
    const areAllCompleted = todos.every(todo => todo.completed);

    if (!areAllCompleted) {
      todos.forEach(todo => {
        if (!todo.completed) {
          onToggle(todo.id);
        }
      });

      return;
    }

    todos.forEach(todo => {
      onToggle(todo.id);
    });
  }, [todos]);

  const onClearCompleted = useCallback(() => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        onDelete(id);
      }
    });
  }, [todos]);

  const onRename = useCallback((newTitle: string, id: number) => {
    const todoToedit = todos.find(todo => todo.id === id);

    if (!todoToedit) {
      showError('Unable to update a todo');

      return;
    }

    const oldTitle = todoToedit.title.trim();

    if (newTitle.trim() === oldTitle) {
      return;
    }

    if (newTitle.trim() === '') {
      onDelete(id);

      return;
    }

    const newData: Pick<Todo, 'title'> = {
      title: newTitle,
    };

    setIsLoading((currentArrIsDelete) => [...currentArrIsDelete, id]);

    editTodo(id, newData)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                ...newData,
              };
            }

            return todo;
          });
        });
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setIsLoading((areLoadingNow) => {
          return areLoadingNow
            .filter(idOfLoadedTodo => idOfLoadedTodo !== id);
        });
      });
  }, [todos]);

  const isClearCompletedHidden = useMemo(() => {
    return todos.some(({ completed }) => completed);
  }, [todos]);

  const isToggleAllActive = useMemo(() => {
    return todos.every(({ completed }) => completed);
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (filterStatus) {
        case 'Active':
          return !completed;
        case 'Completed':
          return completed;
        default:
          return true;
      }
    });
  }, [todos, filterStatus]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          isAdding={isAdding}
          isToggleAllActive={isToggleAllActive}
          onFocus={setNoError}
          onFormSubmit={onTitleSubmit}
          onToggleAll={onToggleAll}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={temporaryTodo}
          isLoading={isLoading}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />

        <Footer
          numberOfItems={visibleTodos.length}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onClearCompleted={onClearCompleted}
          isClearCompletedHidden={isClearCompletedHidden}
        />
      </div>

      <Error
        onClose={setNoError}
        isVisible={noError}
        errorText={errorText}
      />
    </div>
  );
};
