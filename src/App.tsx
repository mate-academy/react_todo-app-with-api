/* eslint-disable jsx-a11y/control-has-associated-label */
import React,
{
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessages } from './components/ErrorMessages';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/Filter';
import { TodoItem } from './components/Todo';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingDataIds, setDeletingDataIds] = useState<number[]>([]);
  const [updatingDataIds, setUpdatingDataIds] = useState<Todo[]>([]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setError(ErrorMessage.unableToLoad);
        });
    }
  }, []);

  const remainingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case 'Completed':
        return todos.filter(todo => todo.completed);

      case 'Active':
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, [todos, filterStatus]);

  const handleSubmitButton = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(ErrorMessage.emptyTitle);

      return;
    }

    if (user) {
      setTempTodo({
        id: 0,
        userId: user.id,
        title,
        completed: false,
      });

      setIsAdding(true);

      addTodo(user.id, title)
        .then(addedTodo => {
          setTodos(prev => [...prev, {
            id: addedTodo.id,
            userId: addedTodo.userId,
            title: addedTodo.title,
            completed: addedTodo.completed,
          }]);
        })
        .catch(() => setError(ErrorMessage.unableToAdd))
        .finally(() => {
          setTitle('');
          setIsAdding(false);
          setTempTodo(null);
        });
    }
  }, [title, user]);

  const handleDeleteButton = useCallback((todoId: number) => {
    setDeletingDataIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(deletedTodo => {
          return deletedTodo.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => setError(ErrorMessage.unableToDelete))
      .finally(() => {
        setDeletingDataIds([]);
      });
  }, []);

  const handleClearButton = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteButton(todo.id);
      }
    });
  };

  const handleUpdateToggle = useCallback((chosenTodo: Todo) => {
    setUpdatingDataIds(updatingData => [...updatingData, chosenTodo]);

    updateTodo(chosenTodo.id, !chosenTodo.completed, chosenTodo.title)
      .then((updatedTodo) => {
        setTodos(currentTodos => currentTodos.map(todo => (
          todo.id !== updatedTodo.id
            ? todo
            : {
              id: updatedTodo.id,
              userId: updatedTodo.userId,
              title: updatedTodo.title,
              completed: updatedTodo.completed,
            }
        )));
      })
      .catch(() => {
        setError(ErrorMessage.unableToUpdate);
      })
      .finally(() => {
        setUpdatingDataIds([]);
      });
  }, []);

  const handleToggleAll = () => {
    const condition = !completedTodos.length
      || completedTodos.length === todos.length;

    if (condition) {
      todos.forEach(todo => {
        handleUpdateToggle(todo);
      });
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          handleUpdateToggle(todo);
        }
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          title={title}
          onChange={setTitle}
          onSubmit={handleSubmitButton}
          isAdding={isAdding}
          toggleAll={handleToggleAll}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteButton}
          deletingDataIds={deletingDataIds}
          onUpdate={handleUpdateToggle}
          updatingDataTodos={updatingDataIds}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isAdding={isAdding}
          />
        )}

        {todos.length > 0
          && (
            <Footer
              remainingTodos={remainingTodos}
              completedTodos={completedTodos}
              setFilterStatus={setFilterStatus}
              filterStatus={filterStatus}
              onClear={handleClearButton}
            />
          )}
      </div>

      <ErrorMessages error={error} setError={setError} />
    </div>
  );
};
