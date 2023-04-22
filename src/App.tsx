import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  createTodos,
  getTodos,
  removeTodo,
  updateTodosCompleted,
  updateTodosTitle,
} from './api/todos';
import { TodosList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoError } from './components/TodoError/TodoError';
import { TodoStatus } from './types/TodoStatus';

const statusTodos = (todos: Todo[], filterBy: TodoStatus) => {
  let filteredTodos = todos;

  switch (filterBy) {
    case TodoStatus.Active:
      filteredTodos = todos.filter(item => !item.completed);
      break;
    case TodoStatus.Completed:
      filteredTodos = todos.filter(item => item.completed);
      break;
    case TodoStatus.All:
    default:
      break;
  }

  return filteredTodos;
};

const USER_ID = 6709;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingCompleted, setIsLoadingComoleted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState(0);
  const [isLoading, setIsLoading] = useState(0);
  const [activeFilter, setActiveFilter] = useState<TodoStatus>(TodoStatus.All);
  const [error, setError] = useState('');
  const [deleteTodoId, setDeleteTodoId] = useState(0);
  const notCompletedTodo = todos.filter(todo => !todo.completed).length;
  const completedTodo = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then((res) => {
        setTodos(res);
      })
      .catch(() => {
        setError('Unable to add a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      });
  }, []);

  const addTodo = (title: string) => {
    if (!title.trim()) {
      setError('Title can`t be empty');
      setTimeout(() => {
        setError('');
      }, 3000);
    } else {
      setIsEditing(0);

      const newTodo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTodo);
      setIsDisabled(true);
      setError('');

      createTodos(USER_ID, newTodo)
        .then((res) => {
          setTodos((prevTodo) => {
            return [...prevTodo, res];
          });
        })
        .catch(() => {
          setError('Unable to add a todo');

          const timer = setTimeout(() => {
            setError('');
          }, 3000);

          return () => {
            clearTimeout(timer);
          };
        })
        .finally(() => {
          setIsDisabled(false);
          setTempTodo(null);
        });
    }
  };

  const deleteTodo = (id: number) => {
    setDeleteTodoId(id);

    removeTodo(id)
      .then(() => {
        const result = todos.filter(todo => todo.id !== id);

        setTodos(result);
        setError('');
      })
      .catch(() => {
        setError('Unable to delete a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      })
      .finally(() => {
        setDeleteTodoId(0);
      });
  };

  const handleChangeCompleted = (id: number) => {
    const currentItem = todos.find(item => item.id === id);

    setIsLoading(id);
    updateTodosCompleted(id, !currentItem?.completed)
      .then((data) => {
        const completed = todos.map(item => (
          item.id === id ? data : item
        ));

        setTodos(completed);
      })
      .catch(() => {
        setError('Unable to update a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      })
      .finally(() => {
        setIsLoading(0);
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(item => {
      if (item.completed) {
        setIsLoadingComoleted(true);
        removeTodo(item.id)
          .then(() => {
            const filteredTodos = todos.filter(items => !items.completed);

            setTodos(filteredTodos);
          })
          .catch(() => {
            setError('Unable to delete a todo');

            const timer = setTimeout(() => {
              setError('');
            }, 3000);

            return () => {
              clearTimeout(timer);
            };
          })
          .finally(() => setIsLoadingComoleted(false));
      }
    });
  };

  const handleCompletedAll = () => {
    todos.forEach((item) => {
      setIsLoadingComoleted(true);
      updateTodosCompleted(item.id, !item.completed)
        .then(() => {
          const completed = todos.map(todo => (
            { ...todo, completed: true }
          ));

          setTodos(completed);
        })
        .catch(() => {
          setError('Unable to update a todo');

          const timer = setTimeout(() => {
            setError('');
          }, 3000);

          return () => {
            clearTimeout(timer);
          };
        })
        .finally(() => {
          setIsLoadingComoleted(false);
        });
    });
  };

  const handleUnCompletedAll = () => {
    todos.forEach((item) => {
      setIsLoadingComoleted(true);
      updateTodosCompleted(item.id, !item.completed)
        .then(() => {
          const completed = todos.map(todo => (
            { ...todo, completed: false }
          ));

          setTodos(completed);
        })
        .catch(() => {
          setError('Unable to update a todo');

          const timer = setTimeout(() => {
            setError('');
          }, 3000);

          return () => {
            clearTimeout(timer);
          };
        })
        .finally(() => {
          setIsLoadingComoleted(false);
        });
    });
  };

  const handleToggleAll = () => {
    setIsLoadingComoleted(true);

    if (todos.some(todo => !todo.completed)) {
      handleCompletedAll();
    } else {
      handleUnCompletedAll();
    }
  };

  const updateTitle = (id: number, title: string) => {
    if (title.trim() === '') {
      deleteTodo(id);
    }

    setIsLoading(id);
    setIsEditing(0);
    updateTodosTitle(id, title)
      .then(res => {
        const result = todos.map(item => {
          if (item.id === res.id) {
            return { ...item, title };
          }

          return item;
        });

        setTodos(result);
      })
      .catch(() => {
        setError('Unable to update a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      })
      .finally(() => {
        setIsLoading(0);
        setError('');
      });
  };

  const handleDoubleClick = (id: number) => {
    setIsEditing(id);
  };

  const filteredTodos = statusTodos(todos, activeFilter);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleToggleAll={handleToggleAll}
          todos={todos}
          addTodo={addTodo}
          isDisabled={isDisabled}
          notCompletedTodo={notCompletedTodo}
        />

        <section className="todoapp__main">
          <TodosList
            todos={filteredTodos}
            handleChangeCompleted={handleChangeCompleted}
            deleteTodo={deleteTodo}
            updateTitle={updateTitle}
            handleDoubleClick={handleDoubleClick}
            setIsEditing={setIsEditing}
            tempTodo={tempTodo}
            deleteTodoId={deleteTodoId}
            isEditing={isEditing}
            isLoading={isLoading}
            isLoadingCompleted={isLoadingCompleted}
          />
        </section>
        {todos.length !== 0 && (
          <footer className="todoapp__footer">
            <TodoFooter
              handleFilter={setActiveFilter}
              activeFilter={activeFilter}
              notCompletedTodo={notCompletedTodo}
              completedTodo={completedTodo}
              handleClearCompleted={handleClearCompleted}
            />
          </footer>
        )}
      </div>

      {error && (<TodoError error={error} setError={setError} />) }
    </div>
  );
};
