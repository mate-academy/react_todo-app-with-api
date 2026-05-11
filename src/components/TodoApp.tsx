import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Filter } from './Filter';
import { TodoList } from './TodoList';
import * as Interaction from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  setError: (str: string) => void;
};

function changeElement(todos: Todo[] | null, newTodo: Todo) {
  if (todos) {
    return todos.map(todo => (todo.id === newTodo.id ? { ...newTodo } : todo));
  }

  return todos;
}

enum Change {
  uncompleteAll = 'uncompleteAll',
  completedAll = 'completedAll',
}

function makeAll(todos: Todo[] | null, change: Change) {
  if (todos) {
    if (change === Change.completedAll) {
      return todos.map(todo =>
        todo.completed === true ? { ...todo, completed: false } : todo,
      );
    } else {
      return todos.map(todo => {
        if (todo.completed === false) {
          return { ...todo, completed: true };
        }

        return todo;
      });
    }
  }

  return todos;
}

export const TodoApp: React.FC<Props> = ({ setError }) => {
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [editing, setEditing] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState(false);
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);
  const [todosFromServer, setTodosFormServer] = useState<Todo[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const focusInput = useRef<HTMLInputElement | null>(null);

  //#region function

  const focusOnInput = useCallback(() => {
    setTimeout(() => {
      focusInput.current?.focus();
    }, 0);
  }, []);

  const updateList = useCallback(() => {
    Interaction.getTodos()
      .then((serverTodos: Todo[] | null) => {
        setTodos(serverTodos);
        setTodosFormServer(serverTodos);
      })
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        setEditing(null);
        setLoadingTodo(false);
        // setActiveTodos([]);
        setTimeout(() => {
          setError('');
        }, 3000);
        focusOnInput();
      });
  }, [setError, focusOnInput]);

  useEffect(() => {
    updateList();
  }, [updateList]);

  const addTodo = useCallback(
    (inputValue: string) => {
      if (inputValue.trim()) {
        setDisabledInput(true);
        const newData: Omit<Todo, 'id'> = {
          userId: Interaction.USER_ID,
          title: inputValue.trim(),
          completed: false,
        };

        setTempTodo({ ...newData, id: 0 });

        setTimeout(
          () =>
            Interaction.addTodo(newData)
              .then(newTodos => {
                setTodos(oldTodos => {
                  if (oldTodos) {
                    return [...oldTodos, newTodos];
                  }

                  return [newTodos];
                });
                setTodosFormServer(oldTodos => {
                  if (oldTodos) {
                    return [...oldTodos, newTodos];
                  }

                  return [newTodos];
                });
                setValue('');
              })
              .catch(() => {
                setError('Unable to add a todo');
              })
              .finally(() => {
                setTempTodo(null);
                setDisabledInput(false);
                focusOnInput();
              }),
          200,
        );
      } else {
        setValue('');
        setError('Title should not be empty');
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    },
    [setError, setTodosFormServer, setTodos, focusOnInput],
  );

  const deleteTodo = useCallback(
    (id: number, activeTodo: Todo) => {
      setLoadingTodo(true);
      setActiveTodos(current =>
        current ? [...current, activeTodo] : [activeTodo],
      );

      return Interaction.deleteTodo(id)
        .then(() => {
          setTodos(prev => (prev ? prev.filter(todo => todo.id !== id) : []));
          setActiveTodos(current =>
            current ? current.filter(todo => todo.id !== id) : [],
          );
          setTodosFormServer(prev =>
            prev ? prev.filter(todo => todo.id !== id) : [],
          );
        })
        .catch(() => {
          setError('Unable to delete a todo');
        })
        .finally(() => {
          focusOnInput();
        });
    },
    [setError, setTodos, setTodosFormServer, focusOnInput],
  );

  const updateTodo = useCallback(
    (newData: Todo) => {
      if (newData.title.trim() === '') {
        deleteTodo(newData.id, newData);
      } else {
        setLoadingTodo(true);
        setActiveTodos(current =>
          current ? [...current, newData] : [newData],
        );

        return Interaction.updateTodo(newData)
          .then(() => {
            if (todosFromServer && todos) {
              setTodosFormServer(currentTodos =>
                changeElement(currentTodos, newData),
              );
              setTodos(currentTodos => changeElement(currentTodos, newData));
              setEditing(null);
              setActiveTodos(current =>
                current ? current.filter(todo => todo.id !== newData.id) : [],
              );
            }
          })
          .catch(() => {
            setError('Unable to update a todo');
          })
          .finally(() => {});
      }
    },
    [setError, deleteTodo, todos, todosFromServer],
  );

  const allUpdateList = useCallback(() => {
    if (todosFromServer) {
      if (todosFromServer.every(todo => todo.completed === true)) {
        Promise.all(
          todosFromServer.map(todo =>
            updateTodo({ ...todo, completed: false }),
          ),
        )
          .then(() => {
            setTodosFormServer(currentTodos =>
              makeAll(currentTodos, Change.completedAll),
            );
            setTodos(currentTodos =>
              makeAll(currentTodos, Change.completedAll),
            );
          })
          .finally(() => setActiveTodos([]));
      } else {
        Promise.all(
          todosFromServer
            .filter(todo => todo.completed === false)
            .map(todo => updateTodo({ ...todo, completed: true })),
        )
          .then(() => {
            setTodosFormServer(currentTodos =>
              makeAll(currentTodos, Change.uncompleteAll),
            );
            setTodos(currentTodos =>
              makeAll(currentTodos, Change.uncompleteAll),
            );
          })
          .finally(() => setActiveTodos([]));
      }
    }
  }, [updateTodo, todosFromServer]);

  //#endregion function

  return (
    <div className="todoapp__content">
      <header className="todoapp__header">
        {!!todosFromServer?.length && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todosFromServer.every(todo => todo.completed === true),
            })}
            data-cy="ToggleAllButton"
            onClick={() => {
              allUpdateList();
            }}
          />
        )}

        <form
          onSubmit={e => {
            e.preventDefault();
            addTodo(value);
          }}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            autoFocus
            ref={focusInput}
            disabled={disabledInput}
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </form>
      </header>

      {todos && (
        <TodoList
          todos={todos}
          updateTodo={prev => updateTodo(prev)}
          deleteTodo={(prevId, prevTodo) => deleteTodo(prevId, prevTodo)}
          editing={editing}
          setEditing={prev => setEditing(prev)}
          loadingTodo={loadingTodo}
          setActiveTodos={setActiveTodos}
          activeTodos={activeTodos}
          tempTodo={tempTodo}
        />
      )}

      {todosFromServer && todosFromServer.length > 0 && (
        <Filter
          todosFromServer={todosFromServer}
          setTodos={prev => setTodos(prev)}
          deleteTodo={(prevId, prevTodo) => deleteTodo(prevId, prevTodo)}
        />
      )}
    </div>
  );
};
