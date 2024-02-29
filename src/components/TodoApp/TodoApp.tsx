/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { TodoList } from '../TodoList/TodoList';
import { TodosFilter } from '../TodosFilter/TodosFilter';
import { Notification } from '../Notification/Notification';
import { Todo } from '../../types/Todo';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../../api/todos';
import { Status } from '../../types/Status';
import { USER_ID } from '../../utils/fetchClient';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [listOfLoadingTodos, setListOfLoadingTodos] = useState<Todo[]>([]);

  const inputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputElement.current && !isSubmitting) {
      inputElement.current.focus();
    }
  }, [isSubmitting, todos]);

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');
        throw error;
      });
  }, []);

  const deleteCurrentTodo = useCallback(
    (todoId: number) => {
      setErrorMessage('');

      return deleteTodo(todoId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        })
        .catch(error => {
          setTodos(todos);
          setErrorMessage('Unable to delete a todo');
          throw error;
        });
    },
    [todos],
  );

  const addNewTodo = useCallback(
    ({ userId, title, completed }: Omit<Todo, 'id'>) => {
      setErrorMessage('');

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      });

      return createTodo({ userId, title, completed })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
        })
        .catch(error => {
          setErrorMessage('Unable to add a todo');
          throw error;
        });
    },
    [],
  );

  const updateCurrentTodo = useCallback(
    (updatedTodo: Todo) => {
      setErrorMessage('');

      if (!updatedTodo.title) {
        deleteCurrentTodo(updatedTodo.id);

        return;
      }

      updateTodo(updatedTodo)
        .then(todo => {
          setTodos(currentTodos => {
            const newTodos = [...currentTodos];

            const index = newTodos.findIndex(
              todo => todo.id === updatedTodo.id,
            );

            newTodos.splice(index, 1, todo);

            return newTodos;
          });

          setListOfLoadingTodos(
            todos.filter(todo => todo.id === updatedTodo.id),
          );
        })
        .catch(error => {
          setErrorMessage('Unable to update a todo');
          throw error;
        })
        .finally(() => {
          setListOfLoadingTodos([]);
        });
    },
    [deleteCurrentTodo, todos],
  );

  const areAllItemsCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const handleToggleAll = () => {
    setIsSubmitting(true);

    if (areAllItemsCompleted) {
      setListOfLoadingTodos(todos);

      todos.forEach(todo => {
        updateCurrentTodo({ ...todo, completed: false });
      });
    }

    if (!areAllItemsCompleted) {
      setListOfLoadingTodos(todos.filter(todo => !todo.completed));

      todos.forEach(todo => {
        if (!todo.completed) {
          updateCurrentTodo({ ...todo, completed: true });
        }
      });

      setTimeout(() => {
        setListOfLoadingTodos([]);
      }, 500);
    }

    setIsSubmitting(false);
  };

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      if (title.trim().length === 0) {
        setErrorMessage('Title should not be empty');

        setTimeout(() => setErrorMessage(''), 3000);

        return;
      }

      setIsSubmitting(true);
      setErrorMessage('');

      addNewTodo({
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      })
        .then(() => {
          setTitle('');
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodo(null);
        });
    },
    [title, addNewTodo],
  );

  const clearCompletedTodos = (currentTodos: Todo[]) => {
    const completed = currentTodos.filter(todo => todo.completed);

    setListOfLoadingTodos(completed);

    currentTodos.forEach(todo => {
      if (todo.completed) {
        deleteCurrentTodo(todo.id);
      }
    });

    setTimeout(() => {
      setListOfLoadingTodos([]);
    }, 500);
    setTodos(currentTodos.filter(todo => !todo.completed));
  };

  const filteredTodos = useMemo(() => {
    const filterTodos = (currentFilter: Status): Todo[] => {
      let currentTodos = todos;

      switch (currentFilter) {
        case Status.All:
          currentTodos = todos;

          break;

        case Status.Active:
          currentTodos = todos.filter(todo => !todo.completed);

          break;

        case Status.Completed:
          currentTodos = todos.filter(todo => todo.completed);

          break;

        default:
          break;
      }

      return currentTodos;
    };

    return filterTodos(filter);
  }, [todos, filter]);

  const numberOfNotCompleted = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const numberOfCompleted = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                // active: !numberOfNotCompleted,
                active: areAllItemsCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={inputElement}
              disabled={isSubmitting}
            />
          </form>
        </header>
        <TodoList
          todos={filteredTodos}
          onDelete={deleteCurrentTodo}
          updateCurrentTodo={updateCurrentTodo}
          listOfLoadingTodos={listOfLoadingTodos}
        />
        {tempTodo && <TodoItem todo={tempTodo} loading={isSubmitting} />}
        {todos.length > 0 && (
          <TodosFilter
            filter={filter}
            setFilter={setFilter}
            numberOfNotCompleted={numberOfNotCompleted}
            numberOfCompleted={numberOfCompleted}
            clearCompletedTodos={clearCompletedTodos}
            todos={todos}
            setListOfLoadingTodos={setListOfLoadingTodos}
          />
        )}
      </div>
      <Notification errorMessage={errorMessage} />
    </div>
  );
};
