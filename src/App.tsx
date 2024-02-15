/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useEffect,
  FC,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  editTodo,
  getTodos,
  removeTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Status } from './types/Status';

const filterTodos = (todos:Todo[], filter:string) => {
  switch (filter) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);

    case Status.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const App: FC = () => {
  const titleField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState(Status.All);
  const [unCompletedTodos, setUncompletedTodos] = useState(0);
  const [allIsCompleted, setAllIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [allCompletedInProcess, setAllCompletedInProcess] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  useEffect(() => {
    let allUnCompletedTodos = 0;

    todos.forEach(todo => {
      allUnCompletedTodos += todo.completed ? 0 : 1;
    });
    setUncompletedTodos(allUnCompletedTodos);

    setAllIsCompleted(allUnCompletedTodos === 0);
  }, [todos]);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos]);

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    setIsDisabled(true);
    event.preventDefault();
    setErrorMessage('');

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      setIsDisabled(false);
    } else {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: newTodoTitle.trim(),
        completed: false,
      });
      addTodo(newTodoTitle.trim())
        .then(res => {
          setNewTodoTitle('');
          setTodos(prev => [...prev, res]);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setIsDisabled(false);
        });
    }
  };

  const removeTodoFromTodos = (todoId: number) => {
    setTodos(prev => prev.filter(existsTodo => existsTodo.id !== todoId));
  };

  const filteredTodos = filterTodos(todos, filter);

  const removeCompletedTodos = async () => {
    setErrorMessage('');
    const completedTodos = todos.filter(todo => todo.completed);
    const removedTodosId: number[] = [];

    try {
      const deletedTodosId = await Promise.allSettled(
        completedTodos.map(el => removeTodo(el.id)),
      );

      for (let i = 0; i < deletedTodosId.length; i += 1) {
        if (deletedTodosId[i].status === 'fulfilled') {
          removedTodosId.push(completedTodos[i].id);
        } else {
          setErrorMessage('Unable to delete a todo');
        }
      }

      setTodos(todos.filter(todo => !removedTodosId.includes(todo.id)));
    } catch (err) {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const changeCompletedTodoById = (todoId: number) => {
    const updatedList = todos.map((editedTodo) => {
      const completedTodo = editedTodo;

      if (completedTodo.id === todoId) {
        completedTodo.completed = !completedTodo.completed;
      }

      return completedTodo;
    });

    setTodos(updatedList);
  };

  const toggleAllCompleted = async () => {
    setAllCompletedInProcess(true);
    setErrorMessage('');

    if (allIsCompleted) {
      setTodos(todos.map(el => {
        return { ...el, loading: true };
      }));
      const listOfSendingTodos = todos.map(el => (
        { ...el, completed: false }
      ));
      const uncompletedTodosId: number[] = [];

      try {
        const editedTodosResponseArr = await Promise.allSettled(
          listOfSendingTodos.map(el => editTodo(el)),
        );

        for (let i = 0; i < editedTodosResponseArr.length; i += 1) {
          if (editedTodosResponseArr[i].status === 'fulfilled') {
            uncompletedTodosId.push(listOfSendingTodos[i].id);
          } else {
            setErrorMessage('Unable to edit a todo');
          }
        }

        setTodos(todos.map(todo => {
          if (uncompletedTodosId.includes(todo.id)) {
            return { ...todo, loading: false, completed: false };
          }

          return todo;
        }));
      } catch (error) {
        setErrorMessage('Unable to edit a todo');
      }
    } else {
      setTodos(todos.map(el => {
        return el.completed ? el : { ...el, loading: true };
      }));

      const notCompletedTodos = todos.filter(todo => !todo.completed);
      const listOfSendingTodos = notCompletedTodos.map(el => (
        { ...el, completed: true }
      ));
      const completedTodosId: number[] = [];

      try {
        const editedTodosResponseArr = await Promise.allSettled(
          listOfSendingTodos.map(el => editTodo(el)),
        );

        for (let i = 0; i < editedTodosResponseArr.length; i += 1) {
          if (editedTodosResponseArr[i].status === 'fulfilled') {
            completedTodosId.push(listOfSendingTodos[i].id);
          } else {
            setErrorMessage('Unable to edit a todo');
          }
        }

        setTodos(todos.map(todo => {
          if (completedTodosId.includes(todo.id)) {
            return { ...todo, loading: false, completed: true };
          }

          return todo;
        }));
      } catch (error) {
        setErrorMessage('Unable to edit a todo');
      }
    }

    setAllCompletedInProcess(false);
  };

  const changeTodoTitleById = (changedTodo:Todo) => {
    setTodos(todos.map(el => {
      if (el.id === changedTodo.id) {
        return { ...el, title: changedTodo.title };
      }

      return el;
    }));
  };

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allIsCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAllCompleted}
              disabled={allCompletedInProcess}
            />
          )}

          <form onSubmit={formSubmitHandler}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              ref={titleField}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isDisabled}
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              removeTodoFromTodos={removeTodoFromTodos}
              changeCompletedTodoById={changeCompletedTodoById}
              setErrorMessage={setErrorMessage}
              changeTodoTitleById={changeTodoTitleById}
            />
            {
              tempTodo && (
                <div data-cy="Todo" className={`todo ${tempTodo.completed && 'completed'}`}>
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <div
                    data-cy="TodoLoader"
                    className="modal overlay is-active"
                  >
                    <div className="modal-background has-background-white" />
                    <div className="loader" />
                  </div>
                </div>
              )
            }
            <TodoFooter
              unCompletedTodos={unCompletedTodos}
              filter={filter}
              setFilter={setFilter}
              todos={todos}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
