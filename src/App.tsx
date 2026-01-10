/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodoRequest,
  deleteTodoRequest,
  getTodosRequest,
  updateTodoRequest,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { NewTodo } from './types/NewTodo';
import { Todo } from './types/Todo';
import { TodoErrors, TodosFilter } from './types/enums';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodosFilter>(TodosFilter.All);
  const [error, setError] = useState<TodoErrors | null>(null);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const newTodoTitleInputRef = useRef<HTMLInputElement | null>(null);
  const [isToggleAllActive, setIsToggleAllActive] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  const displayError = (displayedError: TodoErrors) => {
    setError(displayedError);
    setIsErrorShown(true);
    setTimeout(() => setIsErrorShown(false), 3000);
  };

  useEffect(() => {
    getTodosRequest()
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        displayError(TodoErrors.FetchError);
      });
  }, []);

  useEffect(() => {
    setIsToggleAllActive(todos.every(todo => todo.completed));
  }, [todos]);

  const changeFilter = (newFilter: TodosFilter) => {
    setFilter(newFilter);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addNewTodo = () => {
    const usedTitle = newTodoTitleInputRef.current?.value.trim() ?? '';

    if (usedTitle === '') {
      displayError(TodoErrors.EmptyTitleError);

      return;
    }

    setIsUpdating(true);

    const newTodo: NewTodo = {
      userId: USER_ID,
      title: usedTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    addTodoRequest(newTodo)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        newTodoTitleInputRef.current!.value = '';
      })
      .catch(() => {
        displayError(TodoErrors.AddError);
      })
      .finally(() => {
        setTempTodo(null);
        setIsUpdating(false);
        newTodoTitleInputRef.current?.focus();
      });
  };

  const deleteTodo = (id: number) => {
    setUpdatingIds(prev => new Set(prev).add(id));

    return deleteTodoRequest(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        displayError(TodoErrors.DeleteError);
        throw new Error('Unable to delete a todo');
      })
      .finally(() => {
        newTodoTitleInputRef.current?.focus();
        setUpdatingIds(prev => {
          const newSet = new Set(prev);

          newSet.delete(id);

          return newSet;
        });
      });
  };

  const clearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        deleteTodo(todo.id);
      });
  };

  const updateTodo = (todo: Todo) => {
    setUpdatingIds(prev => new Set(prev).add(todo.id));
    updateTodoRequest(todo)
      .catch(() => {
        displayError(TodoErrors.UpdateError);
      })
      .then(updatedTodo => {
        if (!updatedTodo) {
          displayError(TodoErrors.UpdateError);

          return;
        }

        setTodos(prevTodos =>
          prevTodos.map(todoFromState =>
            todoFromState.id === updatedTodo.id ? updatedTodo : todoFromState,
          ),
        );
      })
      .finally(() => {
        setUpdatingIds(prev => {
          const newSet = new Set(prev);

          newSet.delete(todo.id);

          return newSet;
        });
      });
  };

  const toggleAll = () => {
    todos
      .filter(todo => todo.completed === isToggleAllActive)
      .forEach(todo => updateTodo({ ...todo, completed: !isToggleAllActive }));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isToggleVisible={todos.length > 0}
          isToggleAllActive={isToggleAllActive}
          isUpdating={isUpdating}
          titleInputRef={newTodoTitleInputRef}
          onSubmit={addNewTodo}
          onToggleAll={toggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              filter={filter}
              tempTodo={tempTodo}
              updatingIds={updatingIds}
              onDeleteTodo={deleteTodo}
              onUpdateTodo={updateTodo}
            />

            <Footer
              todos={todos}
              currentFilter={filter}
              handleFilterChange={changeFilter}
              handleClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        visible={isErrorShown}
        handleCloseError={() => setIsErrorShown(false)}
      />
    </div>
  );
};
