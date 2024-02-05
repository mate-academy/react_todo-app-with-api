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
import { Status } from './types/Status';

const USER_ID = 12083;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [erroMessage, setErrorMessage] = useState('');
  const [statusTodo, setStatusTodo] = useState('');
  const [tempTodos, setTempTodos] = useState<Todo[] | null>(null);
  const [isLoad, setIsLoad] = useState(false);

  const myInputRef = useRef<HTMLInputElement>(null);

  // const handleToggleButton = (value: boolean) => {
  //   setIsLoad(true);
  //   setTodos(currentTodos => currentTodos.map(todo => (
  //     {
  //       ...todo,
  //       completed: value,
  //     }
  //   )));

  //   setTempTodos(todos);

  //   Promise.all(todos.map(todo => {
  //     return todoService.updateTodos(todo)
  //       .then((newTodo) => {
  //         const updateTodo = { ...newTodo, completed: value };

  //         // setTodos(currentTodos => currentTodos.map(curT => (curT.id === newTodo.id
  //         //   ? updateTodo
  //         //   : curT
  //         // )));

  //         return updateTodo;
  //       })
  //       .catch(() => {
  //         setErrorMessage('Unable to update a todo');

  //         return todo;
  //       })
  //       .finally(() => {
  //         setInterval(() => setErrorMessage(''), 3000);
  //         setIsLoad(false);
  //       });
  //   }))
  //     .then(updatedTodos => {
  //       setInterval(() => {
  //         setTodos(updatedTodos);
  //       }, 0);
  //     })
  //     .catch(() => {
  //       setErrorMessage('Unable to update a todo');
  //     })
  //     .finally(() => {
  //       setInterval(() => setErrorMessage(''), 3000);
  //       setIsLoad(false);
  //     });

  //   // Promise.all(todos.map(todo => {
  //   //   return todoService.updateTodos(todo)
  //   //     .catch(() => {
  //   //       setErrorMessage('Unable to update a todo');
  //   //     })
  //   //     .finally(() => {
  //   //       setInterval(() => setErrorMessage(''), 3000);
  //   //     });
  //   // }))
  //   //   .catch(() => {
  //   //     setErrorMessage('Unable to update a todo');
  //   //   })
  //   //   .finally(() => {
  //   //     setInterval(() => setErrorMessage(''), 3000);
  //   //     setIsLoad(false);
  //   //   });
  // };

  const handleClearCompleted = () => {
    const completeTodos = todos.filter(todo => todo.completed);

    setIsLoad(true);
    setTempTodos(completeTodos);

    Promise.all(completeTodos.map(delTodo => {
      return todoService.deleteTodos(delTodo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(todo => todo.id !== delTodo.id));
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
        setIsLoad(false);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        myInputRef.current?.focus();
      });
  };

  function filterTodos() {
    switch (statusTodo) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      case Status.All:
        return todos;
      default: return todos;
    }
  }

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

    return todoService.addTodos({
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

  function deleteTodo(id: number) {
    setIsLoad(true);
    const newTamperTodo = todos.find(todo => todo.id === id);

    if (newTamperTodo) {
      setSelectedTodo(newTamperTodo);
    }

    return todoService.deleteTodos(id)
      .then(() => {
        setTodos(currentPosts => currentPosts.filter(todo => todo.id !== id));
      })
      .catch((err) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        throw err;
      })
      .finally(() => {
        setTimeout(() => {
          myInputRef.current?.focus();
        }, 0);
        setIsLoad(true);
        setInterval(() => setErrorMessage(''), 3000);
      });
  }

  function updateTitleTodo(updateTodo: Todo) {
    setSelectedTodo(updateTodo);
    const isSameTitle = todos.some(todo => todo.title === updateTodo.title);

    if (!updateTodo.title.trim()) {
      deleteTodo(updateTodo.id);

      return;
    }

    if (isSameTitle) {
      return;
    }

    setErrorMessage('');
    setIsLoad(true);

    todoService.updateTodos(updateTodo)
      .then((newTodo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = currentTodos.findIndex(todo => todo.id === updateTodo.id);

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
        setIsLoad(false);
      });
  }

  function updateComplitedTodos(updateTodo: Todo) {
    setErrorMessage('');
    setIsLoad(true);

    todoService.updateTodos(updateTodo)
      .then((newTodo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = currentTodos.findIndex(todo => todo.id === updateTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })

      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setInterval(() => setErrorMessage(''), 3000);
        setIsLoad(false);
      });
  }

  const handleToggleButton = () => {
    setIsLoad(true);

    const isAllCompleted = todos.every(todo => todo.completed);

    if (isAllCompleted) {
      Promise.all(todos.map(async todo => {
        try {
          return await todoService.updateTodos({ ...todo, completed: false });
        } catch (err) {
          setErrorMessage('Unable to update todos');

          return todo;
        } finally {
          setInterval(() => setErrorMessage(''), 3000);
          setIsLoad(false);
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
          setIsLoad(false);
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
        const newTodo = await todoService.updateTodos(updateTodo);

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
        setIsLoad(false);
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
          // eslint-disable-next-line react/jsx-no-bind
          onSubmit={addTodo}
          selectedTodo={selectedTodo}
          // statusTodo={statusTodo}
          todos={todos}
          myInputRef={myInputRef}
          setAllCompleted={handleToggleButton}
        />

        <Section
          onSelect={async (newValue) => {
            setSelectedTodo(newValue);
            updateComplitedTodos(newValue);
          }}
          onDubleClick={async (newValue) => {
            await updateTitleTodo(newValue);
          }}
          filteredTodos={filterTodos()}
          // eslint-disable-next-line react/jsx-no-bind
          onDelete={deleteTodo}
          tempTodo={tempTodo}
          tempTodos={tempTodos}
          isLoad={isLoad}
          selectedTodo={selectedTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            onStatus={(newStatus: string) => setStatusTodo(newStatus)}
            status={statusTodo}
            todos={todos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
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
        {/* show only one message at a time */}
        {erroMessage}
      </div>
    </div>
  );
};
