/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateCompletedTodo,
} from './api/todos';
import { ToDoHeader } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorType } from './types/ErrorType';
import { Errors } from './components/Error/Error';
import classNames from 'classnames';

type TempTodo = {
  id: number;
  completed: boolean;
  title: string;
  userId: number;
};

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.all);
  const [taskTitle, setTaskTitle] = useState('');
  const [allDone, setAllDone] = useState(false);
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState<number[] | []>([]);
  const [newTitle, setNewTitle] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const completedTodos = tasks?.filter(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  const errorType: ErrorType = {
    empty: 'Title should not be empty',
    load: 'Unable to load todos',
    add: 'Unable to add a todo',
    found: 'Todo not found',
    deleteTask: 'Unable to delete a todo',
    updateTodo: 'Unable to update a todo',
  };

  const taskLeft = tasks?.filter(
    task => !task.completed && task.id != 0,
  ).length;

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const filterTodo: (todos: Todo[], mode: Status) => Todo[] = (todos, mode) => {
    switch (mode) {
      case Status.completed:
        return todos.filter(task => task.completed);
      case Status.active:
        return todos.filter(task => !task.completed);
      case Status.all:
      default:
        return tasks;
    }
  };

  const filteredTodos = filterTodo(tasks, status);

  const handleError: (errorMsg: string) => void = errorMsg => {
    setErrorMessage(errorMsg);
  };

  const addNewTodo = async (creatNewTodo: Todo) => {
    try {
      setTasks(currentTodos => [...currentTodos, creatNewTodo]);
      setIsUpdating([0]);

      const newTodo: Todo = await addTodo(creatNewTodo);

      setTasks(currentTodos => {
        currentTodos.pop();

        return [...currentTodos, newTodo];
      });
      setTaskTitle('');
    } catch {
      setTasks(currentTodos => {
        currentTodos.pop();

        return [...currentTodos];
      });
      handleError(errorType.add);
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
      focusInput();
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const title = taskTitle.trim();

    if (!title) {
      handleError(errorType.empty);

      return;
    }

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    setIsSubmitting(true);
    addNewTodo(newTodo);
  };

  const handleAllCompleted = () => {
    const isAllDone = tasks.every(task => task.completed);
    const updatedTasks = tasks.map(task => ({
      ...task,
      completed: !isAllDone,
    }));

    updatedTasks.forEach(updatedTask => {
      const originalTask = tasks.find(task => task.id === updatedTask.id);

      if (originalTask && originalTask.completed !== updatedTask.completed) {
        setIsUpdating(current => [...current, updatedTask.id]);
        updateCompletedTodo(updatedTask.id, updatedTask)
          .then(() => {
            setIsUpdating(current =>
              current.filter(id => id !== updatedTask.id),
            );
          })
          .catch(() => {
            handleError(errorType.updateTodo);
            setIsUpdating(current =>
              current.filter(id => id !== updatedTask.id),
            );
          });
      }
    });

    setTasks(updatedTasks);
  };

  const deleteTask = (id: number) => {
    setDeletingIds(prevIds => [...prevIds, id]);
    deleteTodo(id)
      .then(() => {
        if (canEdit === true) {
          setCanEdit(false);
        }

        setTasks(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setDeletingIds(prevIds =>
          prevIds.filter(deletingId => deletingId !== id),
        );
        focusInput();
      })
      .catch(() => {
        if (canEdit === true) {
          setCanEdit(true);
        }

        handleError(errorType.deleteTask);
        setDeletingIds([]);
      });
  };

  const clearCompleted = () => {
    Promise.all(
      completedTodos.map(todo => {
        deleteTask(todo.id);
        setIsUpdating([]);
      }),
    ).then(() => {
      focusInput();
    });
  };

  const handleCompleted = (id: number) => {
    setIsUpdating(current => [...current, id]);
    const todoToUpdate = tasks.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setErrorMessage(errorType.found);

      return;
    }

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    updateCompletedTodo(id, updatedTodo)
      .then(() => {
        const updatedTasks = tasks.map(todo =>
          todo.id === id ? updatedTodo : todo,
        );

        setTasks(updatedTasks);
        setIsUpdating([]);
      })
      .catch(() => {
        handleError(errorType.updateTodo);
        setIsUpdating([]);
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTasks)
      .then(() => focusInput())
      .catch(() => handleError(errorType.load));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  useEffect(() => {
    if (taskLeft > 0) {
      return setAllDone(false);
    } else if (taskLeft == 0) {
      return setAllDone(true);
    }
  }, [taskLeft]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <ToDoHeader
          handleAllCompleted={handleAllCompleted}
          allDone={allDone}
          handleSubmit={handleSubmit}
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          IsSubmitting={IsSubmitting}
          inputRef={inputRef}
          taskLengthForButton={tasks.length}
        />
        <TodoList
          filteredTodos={filteredTodos}
          handleCompleted={handleCompleted}
          tempTodo={tempTodo}
          deleteTask={deleteTask}
          deletingIds={deletingIds}
          onUpdate={isUpdating}
          setNewTitle={setNewTitle}
          newTitle={newTitle}
          handleError={handleError}
          setTasks={setTasks}
          setErrorMessage={setErrorMessage}
          tasks={tasks}
          setIsUpdating={setIsUpdating}
          IsSubmitting={IsSubmitting}
          setIsSubmitting={setIsSubmitting}
          canEdit={canEdit}
          setCanEdit={setCanEdit}
        />

        {/* Hide the footer if there are no todos */}
        {tasks.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {taskLeft} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: status === Status.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setStatus(Status.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: status === Status.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setStatus(Status.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: status === Status.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setStatus(Status.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => clearCompleted()}
              disabled={completedTodos.length == 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Errors errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
