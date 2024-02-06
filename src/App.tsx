/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import {
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './Components/Header';
import { Section } from './Components/Section';
import { Footer } from './Components/Footer';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { filterTodos } from './utils/services';

const USER_ID = 12083;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [erroMessage, setErrorMessage] = useState('');
  const [statusTodo, setStatusTodo] = useState('');
  const [tempTodos, setTempTodos] = useState<Todo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const myInputRef = useRef<HTMLInputElement>(null);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsLoading(true);
    setTempTodos(completedTodos);

    Promise.all(completedTodos.map(todo => {
      return todoService.deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(curTodo => curTodo.id !== todo.id));
        })
        .catch((err) => {
          setErrorMessage('Unable to delete a todo');
          throw err;
        });
    }))
      .catch((err) => {
        setErrorMessage('Unable to delete a todo');
        throw err;
      })
      .finally(() => {
        setTempTodos(null);
        setIsLoading(false);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        myInputRef.current?.focus();
      });
  };

  useEffect(() => {
    setErrorMessage('');
    todoService.getTodos(USER_ID)
      .then((response: SetStateAction<Todo[]>) => setTodos(response))
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setInterval(() => setErrorMessage(''), 3000));
  }, []);

  function addTodo({
    title,
    userId,
    completed,
  }: Todo) {
    setErrorMessage('');

    const newTamperTodo = {
      title,
      userId,
      completed,
      id: 0,
    };

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        myInputRef.current?.focus();
      }, 0);

      return Promise.resolve();
    }

    setTempTodo(newTamperTodo);

    return todoService.addTodo({
      title,
      userId,
      completed,
    })
      .then(
        (newTodo: Todo) => {
          if (newTodo.title) {
            setTodos(currentTodos => [...currentTodos, newTodo]);
          }
        },
      )
      .catch((err: unknown) => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          myInputRef.current?.focus();
        }, 0);
        throw err;
      })
      .finally(() => {
        setInterval(() => setErrorMessage(''), 3000);
        setTempTodo(null);
      });
  }

  const handleAddTodo = (newTodo: Todo) => {
    return addTodo(newTodo);
  };

  async function deleteTodo(id: number) {
    setIsLoading(true);
    const newTamperTodo = todos.find(todo => todo.id === id);

    if (newTamperTodo) {
      setSelectedTodo(newTamperTodo);
    }

    return todoService.deleteTodo(id)
      .then(() => {
        setTodos(currentPosts => currentPosts.filter(todo => todo.id !== id));
        setTimeout(() => {
          myInputRef.current?.focus();
        }, 0);
      })
      .catch((err) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');

        throw err;
      })
      .finally(() => {
        setIsLoading(false);
        setInterval(() => setErrorMessage(''), 3000);
      });
  }

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
  };

  async function updateTitleTodo(updatedTodo: Todo) {
    setSelectedTodo(updatedTodo);
    const isSameTitle = todos.some(todo => todo.title === updatedTodo.title);

    if (!updatedTodo.title.trim()) {
      // eslint-disable-next-line no-useless-catch
      try {
        await deleteTodo(updatedTodo.id);
      } catch (error) {
        throw error;
      }

      return;
    }

    if (isSameTitle) {
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    await todoService.updateTodo(updatedTodo)
      .then((newTodo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = currentTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
        setSelectedTodo(null);
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');

        throw error;
      })
      .finally(() => {
        setInterval(() => setErrorMessage(''), 3000);
        setIsLoading(false);
      });
  }

  const handleDubleClick = async (newValue: Todo) => {
    // eslint-disable-next-line no-useless-catch
    try {
      await updateTitleTodo(newValue);
    } catch (error) {
      throw error;
    }
  };

  function updateComplitedTodos(updatedTodo: Todo) {
    setErrorMessage('');
    setIsLoading(true);

    todoService.updateTodo(updatedTodo)
      .then((newTodo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = currentTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })

      .catch((err) => {
        setErrorMessage('Unable to update a todo');
        throw err;
      })
      .finally(() => {
        setInterval(() => setErrorMessage(''), 3000);
        setIsLoading(false);
      });
  }

  const handleToggleButton = () => {
    setIsLoading(true);

    const isAllCompleted = todos.every(todo => todo.completed);

    if (isAllCompleted) {
      Promise.all(todos.map(async todo => {
        try {
          return await todoService.updateTodo({ ...todo, completed: false });
        } catch (err) {
          setErrorMessage('Unable to update todos');

          return todo;
        } finally {
          setInterval(() => setErrorMessage(''), 3000);
          setIsLoading(false);
          setTempTodos(null);
        }
      }))
        .then((upTodos) => {
          setTodos(upTodos);
        })
        .catch(() => {
          setTodos(todos);
          setErrorMessage('Unable to update todos');
        })
        .finally(() => {
          setInterval(() => setErrorMessage(''), 3000);
          setIsLoading(false);
          setTempTodos(null);
        });
    }

    const notComplitedTodo = todos.filter(todo => !todo.completed);

    const temperTodo = notComplitedTodo.map(todo => ({
      ...todo,
      completed: true,
    }));
    const complitedTodos = todos.filter(todo => todo.completed);

    setTempTodos(temperTodo);

    Promise.all(notComplitedTodo.map(async todo => {
      try {
        const updateTodo = { ...todo, completed: true };
        const newTodo = await todoService.updateTodo(updateTodo);

        return newTodo;
      } catch (error) {
        return todo;
      }
    }))
      .then(upTodos => {
        setTodos([...upTodos, ...complitedTodos]);
      })
      .catch(() => {
        setErrorMessage('Unable to update todos');
      })
      .finally(() => {
        setInterval(() => setErrorMessage(''), 3000);
        setIsLoading(false);
        setTempTodos(null);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          userId={USER_ID}
          onSubmit={handleAddTodo}
          selectedTodo={selectedTodo}
          todos={todos}
          myInputRef={myInputRef}
          setAllCompleted={handleToggleButton}
        />

        <Section
          onSelect={async (newValue) => {
            setSelectedTodo(newValue);
            await updateComplitedTodos(newValue);
          }}
          onDubleClick={handleDubleClick}
          filteredTodos={filterTodos(statusTodo, todos)}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
          tempTodos={tempTodos}
          isLoading={isLoading}
          selectedTodo={selectedTodo}
        />

        {todos.length && (
          <Footer
            onStatus={(newStatus: string) => setStatusTodo(newStatus)}
            status={statusTodo}
            todos={todos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-dangers-light has-text-weight-normal',
          { hidden: !erroMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {erroMessage}
      </div>
    </div>
  );
};
