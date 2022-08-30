/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames/bind';
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addTodo,
  changeTodoStatus,
  changeTodoTitle,
  deleteTodo,
  getTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoError } from './components/TodoError/TodoError';
import { Todo } from './types/Todo';
import { SortType } from './types/SortType';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const editField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputtext] = useState('');
  // eslint-disable-next-line
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  // eslint-disable-next-line
  const [isDoubleClicked, setIsDoubleCliked] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number>();
  const [todoInputText, setTodoInputText] = useState<string>('');
  const [currentSortType,
    setCurrentSortType] = useState<SortType>(SortType.default);
  // eslint-disable-next-line
  const [currentError, setCurrentError] = useState<ErrorType>(ErrorType.noError);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then((newTodos) => setTodos(newTodos));
    }
  }, [user]);

  const visibleTodos = useMemo(() => {
    switch (currentSortType) {
      case SortType.active:
        return todos.filter(todo => !todo.completed);
      case SortType.completed:
        return todos.filter(todo => todo.completed);
      default:
        return [...todos];
    }
  }, [currentSortType, todos]);

  const allTodosStatus = useMemo(() => {
    return todos.some(todo => todo.completed === false);
  }, [todos]);

  const newTodoAddHandler = (event: React.FormEvent) => {
    setCurrentError(ErrorType.noError);
    event.preventDefault();
    const id = Math.random();

    if (inputText.trim().length === 0) {
      setCurrentError(ErrorType.whenEmptyTitle);

      return;
    }

    if (user) {
      const newTodo: Todo = {
        id,
        userId: user.id,
        title: inputText,
        completed: false,
      };

      setLoadingTodosId(prev => [...prev, id]);
      setTodos((currTodos) => [...currTodos, newTodo]);

      addTodo(newTodo)
        .then((returnedTodo: Todo) => {
          setTodos((currtodos) => currtodos.map(todo => {
            const prepTodo = { ...todo };

            if (prepTodo.id === id) {
              prepTodo.id = returnedTodo.id;
            }

            return prepTodo;
          }));
        })
        .catch(() => {
          setTodos(currTodos => currTodos.filter(todo => todo.id !== id));
          setCurrentError(ErrorType.whenAddTodo);
        })
        .finally(() => (
          setLoadingTodosId(prev => prev.filter(curr => curr !== newTodo.id))
        ));
    }

    setInputtext('');
  };

  const changeTodoStatusHandler = (todo: Todo) => {
    setCurrentError(ErrorType.noError);
    setLoadingTodosId(todosId => [...todosId, todo.id]);

    changeTodoStatus(todo)
      .then((returnedTodo: Todo) => {
        setTodos((currtodos) => currtodos.map(currTodo => {
          const prepTodo = { ...currTodo };

          if (prepTodo.id === returnedTodo.id) {
            prepTodo.completed = returnedTodo.completed;
          }

          return prepTodo;
        }));
      })
      .catch(() => (
        setCurrentError(ErrorType.whenChangeStatus)
      ))
      .finally(() => (
        setLoadingTodosId(todosId => todosId.filter(curr => curr !== todo.id))
      ));
  };

  const deleteTodoHandler = (todo: Todo) => {
    setCurrentError(ErrorType.noError);
    setLoadingTodosId(todosId => [...todosId, todo.id]);

    deleteTodo(todo)
      .then(() => {
        setTodos((currtodos) => currtodos.filter(currTodo => {
          if (currTodo.id === todo.id) {
            return false;
          }

          return true;
        }));
      })
      .catch(() => (
        setCurrentError(ErrorType.whenDeleteTodo)
      ))
      .finally(() => (
        setLoadingTodosId(todosId => todosId.filter(curr => curr !== todo.id))
      ));
  };

  const resetTodoEditPreferences = (key = 'Escape') => {
    if (key === 'Escape') {
      setIsDoubleCliked(false);
      setSelectedTodoId(0);
      setTodoInputText('');
    }
  };

  const changeTodoTitleHandler = (event: React.FormEvent, todo: Todo) => {
    setCurrentError(ErrorType.noError);
    event.preventDefault();

    if (todoInputText.length === 0) {
      deleteTodoHandler(todo);
    } else if (todoInputText !== todo.title) {
      setLoadingTodosId(todosId => [...todosId, todo.id]);
      changeTodoTitle(todo, todoInputText)
        .then((returnedTodo: Todo) => {
          setTodos((currTodos) => currTodos.map(currTodo => {
            const prepTodo = { ...currTodo };

            if (prepTodo.id === returnedTodo.id) {
              prepTodo.title = returnedTodo.title;
            }

            return prepTodo;
          }));
        })
        .catch(() => (
          setCurrentError(ErrorType.whenChangeTitle)
        ))
        .finally(() => {
          resetTodoEditPreferences();
          setLoadingTodosId(todosId => (
            todosId.filter(curr => curr !== todo.id)
          ));
        });
    } else {
      resetTodoEditPreferences();
    }
  };

  const clearComplitedHandler = () => {
    setCurrentError(ErrorType.noError);
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodoHandler(todo);
      }
    });
  };

  const changeAllTodosStatus = () => {
    if (allTodosStatus) {
      todos.forEach(todo => {
        if (todo.completed === false) {
          changeTodoStatusHandler(todo);
        }
      });
    } else {
      todos.forEach(todo => changeTodoStatusHandler(todo));
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (editField.current) {
      editField.current.focus();
    }
  }, [isDoubleClicked]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: !allTodosStatus },
            )}
            onClick={() => (changeAllTodosStatus())}
          />

          <form
            onSubmit={(event) => (newTodoAddHandler(event))}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputText}
              onChange={(event) => setInputtext(event.target.value)}
            />
          </form>
        </header>

        {todos && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <div
                data-cy="Todo"
                className={classNames('todo', { completed: todo.completed })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked
                    onChange={() => (changeTodoStatusHandler(todo))}
                  />
                </label>
                {selectedTodoId === todo.id
                  ? (
                    <form onSubmit={(event) => (
                      changeTodoTitleHandler(event, todo))}
                    >
                      <input
                        data-cy="TodoTitleField"
                        type="text"
                        className="todo__title-field"
                        placeholder="Empty todo will be deleted"
                        value={todoInputText}
                        ref={editField}
                        onChange={(event) => (
                          setTodoInputText(event.target.value)
                        )}
                        onBlur={(event) => (
                          changeTodoTitleHandler(event, todo)
                        )}
                        onKeyDown={(event) => (
                          resetTodoEditPreferences(event.key)
                        )}
                      />
                    </form>
                  )
                  : (
                    <>
                      <span
                        data-cy="TodoTitle"
                        className="todo__title"
                        onDoubleClick={() => {
                          setIsDoubleCliked(true);
                          setSelectedTodoId(todo.id);
                          setTodoInputText(todo.title);
                        }}
                      >
                        {todo.title}
                      </span>

                      <button
                        type="button"
                        className="todo__remove"
                        data-cy="TodoDeleteButton"
                        onClick={() => (deleteTodoHandler(todo))}
                      >
                        ×
                      </button>
                    </>
                  )}

                <div
                  data-cy="TodoLoader"
                  className={classNames(
                    'modal',
                    'overlay',
                    { 'is-active': loadingTodosId.includes(todo.id) },
                  )}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}

          </section>
        )}

        <TodoFooter
          todos={todos}
          sortType={currentSortType}
          setSortType={setCurrentSortType}
          clearComplited={clearComplitedHandler}
        />

      </div>
      {currentError !== ErrorType.noError && (
        <TodoError
          currentError={currentError}
          setCurrentError={setCurrentError}
        />
      )}
    </div>
  );
};
