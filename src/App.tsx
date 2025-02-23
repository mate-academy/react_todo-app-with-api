/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import classNames from 'classnames';
import { getTodos } from './api/todos';
import { postTodo } from './api/todos';
import { deleteTodo } from './api/todos';
import { setCompletedTodo } from './api/todos';
import { Footer } from './components/Footer';
import { HeaderInput } from './components/HeaderInput';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Types';
import { Errors } from './types/Types';
import { SelectedTasks } from './types/Types';

const USER_ID = 398;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<SelectedTasks>(
    SelectedTasks.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [title, setTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [deleteTodoByID, setDeleteTodoByID] = useState<number | null>();

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.Load));
    setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  const addNewTodo = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    setIsAddingTodo(true);

    const temp = {
      title: trimmedTitle,
      id: 0,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);
    setErrorMessage(null);

    postTodo(temp)
      .then((res: Todo) => {
        setTodos(prev => [...prev, res]);
        setTitle('');
      })
      .catch(() => setErrorMessage(Errors.Add))
      .finally(() => {
        setTempTodo(null);
        setIsAddingTodo(false);
      });
  };

  const deleteCurrentTodo = useCallback((id: number) => {
    setDeleteTodoByID(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(Errors.Delete);
      })
      .finally(() => setDeleteTodoByID(null));
  }, []);

  const toggleCompleted = async (id: number) => {
    try {
      await setCompletedTodo({
        id,
        completed: !todos.find(todo => todo.id === id)?.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    } catch {
      setErrorMessage(Errors.Update);
    }
  };

  const toggleAll = async () => {
    try {
      const isAnyUncompleted = todos.some(todo => !todo.completed);
      const completedValue = isAnyUncompleted ? true : false;

      const updatePromises = todos.map(async todo => {
        try {
          if (todo.completed !== completedValue) {
            await setCompletedTodo({
              id: todo.id,
              completed: completedValue,
            });
          }
        } catch {
          setErrorMessage(Errors.Update);
        }
      });

      await Promise.all(updatePromises);

      setTodos(prevTodos =>
        prevTodos.map(prevTodo => ({
          ...prevTodo,
          completed: completedValue,
        })),
      );
    } catch {
      setErrorMessage(Errors.Update);
    }
  };

  const clearCompleted = async () => {
    try {
      const completedTodoIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      const deletePromises = completedTodoIds.map(id =>
        deleteTodo(id)
          .then(() => {
            setTodos(prevTodos =>
              prevTodos.filter(prevTodo => prevTodo.id !== id),
            );
          })
          .catch(() => {
            setErrorMessage(Errors.Delete);
          }),
      );

      await Promise.allSettled(deletePromises);
    } catch (error) {
      setErrorMessage(Errors.Delete);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = (todosToFilter: Todo[]) => {
    let filteredTodos: Todo[] = [];

    switch (selectedTasks) {
      case SelectedTasks.All:
        filteredTodos = todosToFilter;
        break;
      case SelectedTasks.Completed:
        filteredTodos = todosToFilter.filter(todo => todo.completed === true);
        break;
      case SelectedTasks.Active:
        filteredTodos = todosToFilter.filter(todo => todo.completed === false);
        break;
      default:
        filteredTodos = todosToFilter;
        break;
    }

    return filteredTodos;
  };

  const updateTodoTitle = (todoId: number, newTitle: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, title: newTitle };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const filteredTodos = filterTodos(todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderInput
          addNewTodo={addNewTodo}
          setTitle={setTitle}
          title={title}
          disabled={isAddingTodo}
          toggleAll={toggleAll}
          todos={todos}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteCurrentTodo={deleteCurrentTodo}
          deleteTodoByID={deleteTodoByID}
          toggleCompleted={toggleCompleted}
          setErrorMessage={setErrorMessage}
          updateTodoTitle={updateTodoTitle}
        />

        {!!todos?.length && (
          <Footer
            todos={todos}
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
