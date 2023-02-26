/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { TodoSelector } from './types/TodoSelector';
import {
  deleteTodo, getTodos, postTodo, updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';

const USER_ID = 6419;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [todoSelector, setTodoSelector] = useState<string | null>(
    TodoSelector.ALL,
  );
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [titleUpdatingTodoId, setTitleUpdatingTodoId] = useState<number | null>(
    null,
  );
  const [editedTitleValue, setEditedTitleValue] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setError(new Error('Unable to get todos from server'));
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTitleUpdatingTodoId(null);
      }
    };

    window.addEventListener('keyup', handleEsc);

    return () => {
      window.removeEventListener('keyup', handleEsc);
    };
  }, []);

  const deleteErrorMessage = () => {
    setError(null);
  };

  const deleteErrorMessageAfterDelay = (delay: number) => {
    setTimeout(() => {
      setError(null);
    }, delay);
  };

  const getVisibleTodos = () => {
    const needsToFilter
      = todoSelector === TodoSelector.ACTIVE
      || todoSelector === TodoSelector.COMPLETED;

    if (!needsToFilter) {
      return todos;
    }

    return todos.filter((todo) => {
      switch (todoSelector) {
        case TodoSelector.ACTIVE:
          return !todo.completed;
        case TodoSelector.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });
  };

  const visibleTodos = useMemo(getVisibleTodos, [todos, todoSelector]);

  const hasCompletedTodos = todos.some((todo) => todo.completed);
  const areAllTodosCompleted = todos.every((todo) => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const leftTodosCount = todos.reduce((acc, todo) => {
    return !todo.completed ? acc + 1 : acc;
  }, 0);

  const handleTodoSelection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setTodoSelector(e.currentTarget.textContent);
  };

  const handleTodoInputChanging = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setInputValue(value);
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError(new Error("Title can't be empty"));
      deleteErrorMessageAfterDelay(3000);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    postTodo(newTodo)
      .then((response) => {
        setTodos((t) => [...t, response]);
        setTempTodo(null);
        setInputValue('');
      })
      .catch(() => {
        setError(new Error('Unable to add a todo'));
        deleteErrorMessageAfterDelay(3000);
      });

    setTempTodo(newTodo);
  };

  const handleDeleteTodo = (todoId: number) => () => {
    setIsDeleting(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
        setIsDeleting(false);
      })
      .catch(() => {
        setIsDeleting(false);
        setError(new Error('Unable to delete a todo'));
        deleteErrorMessageAfterDelay(3000);
      });
  };

  const handleCompletedTodoDeleting = () => {
    todos
      .filter((todo) => todo.completed)
      .forEach((todo) => {
        handleDeleteTodo(todo.id)();
      });
  };

  const handleUpdateTodoStatus = (updatedTodo: Todo) => () => {
    setIsStatusUpdating(true);

    updateTodo(updatedTodo)
      .then(() => {
        setTodos((prevTodos) => {
          return prevTodos.map((todo) => {
            if (todo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return todo;
          });
        });

        setIsStatusUpdating(false);
      })
      .catch(() => {
        setIsStatusUpdating(false);
        setError(new Error('Unable to update a todo'));
        deleteErrorMessageAfterDelay(3000);
      });
  };

  const handleUpdateAllTodosStatus = () => {
    if (!areAllTodosCompleted) {
      todos.forEach((todo) => {
        handleUpdateTodoStatus({
          ...todo,
          completed: true,
        })();
      });
    } else {
      todos.forEach((todo) => {
        handleUpdateTodoStatus({
          ...todo,
          completed: false,
        })();
      });
    }
  };

  const handleUpdateTodoTitle = (todo: Todo) => () => {
    setTitleUpdatingTodoId(todo.id);
    setEditedTitleValue(todo.title);
  };

  const handleChangeTodoTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setEditedTitleValue(value);
  };

  const handleSubmitUpdatedTodoTitle
    = (todo: Todo) => (
      e:
      | React.FormEvent<HTMLFormElement>
      | React.FocusEvent<HTMLInputElement, Element>,
    ) => {
      e.preventDefault();

      if (editedTitleValue.trim() === todo.title) {
        setTitleUpdatingTodoId(null);

        return;
      }

      if (!editedTitleValue.trim()) {
        handleDeleteTodo(todo.id)();

        return;
      }

      const updatedTodo = {
        ...todo,
        title: editedTitleValue.trim(),
      };

      setTitleUpdatingTodoId(todo.id);

      updateTodo(updatedTodo)
        .then(() => {
          setTodos((prevTodos) => {
            return prevTodos.map((t) => {
              if (t.id === updatedTodo.id) {
                return updatedTodo;
              }

              return t;
            });
          });

          setTitleUpdatingTodoId(null);
        })
        .catch(() => {
          setTitleUpdatingTodoId(null);
          setError(new Error('Unable to update a todo'));
          deleteErrorMessageAfterDelay(3000);
        });
    };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          inputValue={inputValue}
          tempTodo={tempTodo}
          onChangeTodoInput={handleTodoInputChanging}
          onSubmitTodo={handleAddTodo}
          onUpdateAllTodosStatus={handleUpdateAllTodosStatus}
          areAllTodosCompleted={areAllTodosCompleted}
        />

        {todos.length > 0 && (
          <TodoList
            tempTodo={tempTodo}
            todos={visibleTodos}
            isDeleting={isDeleting}
            onDeleteTodo={handleDeleteTodo}
            isStatusUpdating={isStatusUpdating}
            onUpdateTodoStatus={handleUpdateTodoStatus}
            titleUpdatingTodoId={titleUpdatingTodoId}
            editedTitleValue={editedTitleValue}
            onUpdateTodoTitle={handleUpdateTodoTitle}
            onChangeTodoTitle={handleChangeTodoTitle}
            onSubmitUpdatedTodoTitle={handleSubmitUpdatedTodoTitle}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            hasCompletedTodos={hasCompletedTodos}
            leftTodosCount={leftTodosCount}
            todoSelector={todoSelector}
            onChangeTodoSelector={handleTodoSelection}
            onClearCompleted={handleCompletedTodoDeleting}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {error && (
        <div
          className={cn(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !error },
          )}
        >
          <button
            type="button"
            className="delete"
            onClick={deleteErrorMessage}
          />

          {error.message}
        </div>
      )}
    </div>
  );
};
