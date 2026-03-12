/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  updateTodo,
  addTodo,
  deleteTodo,
  getTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { Filter } from './types/Filter';
import { Error } from './types/ErrorMsg';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMsg, setErrorMsg] = useState<Error | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [processingId, setProcessingId] = useState<number[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setErrorMsg('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMsg(Error.Fetch);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleErrorClose = () => {
    setErrorMsg('');
  };

  const onAddTodo = (title: string) => {
    setIsSubmiting(true);
    setErrorMsg('');

    const newTodo = {
      id: 0,
      title: title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    addTodo(newTodo)
      .then(created => {
        setTodos(prev => [...prev, created]);
        setTodoTitle('');
      })
      .catch(error => {
        setErrorMsg(Error.Add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmiting(false);
      });
  };

  const handleOnDelete = (id: number) => {
    setProcessingId(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMsg(Error.Delete);
      })
      .finally(() => {
        setProcessingId(prev => prev.filter(i => i !== id));
      });
  };

  const onDeleteCompletedTodos = () => {
    const completedIds = todos.filter(todo => todo.completed);

    if (completedIds.length === 0) {
      return;
    }

    completedIds.forEach(todo => {
      handleOnDelete(todo.id);
    });
  };

  const allTodosCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  const handleToggleTodo = (todo: Todo) => {
    const id = todo.id;

    setProcessingId(prev => [...prev, id]);
    setErrorMsg('');

    updateTodo(id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(item => (item.id === id ? updatedTodo : item)),
        );
      })
      .catch(() => {
        setErrorMsg(Error.Update);
      })
      .finally(() => {
        setProcessingId(prev => prev.filter(i => i !== id));
      });
  };

  const handleToggleAll = () => {
    setErrorMsg('');

    const status = allTodosCompleted;

    const activeItems = todos.filter(todo => todo.completed === status);

    activeItems.forEach(todo => {
      handleToggleTodo(todo);
    });
  };

  const handleUpdateTodo = (
    todo: Todo,
    data: { title: string },
  ): Promise<void> => {
    setErrorMsg('');
    setProcessingId(prev => [...prev, todo.id]);

    return updateTodo(todo.id, data)
      .then(updatedTodo => {
        setTodos(current =>
          current.map(item => (item.id === todo.id ? updatedTodo : item)),
        );
      })
      .catch(err => {
        setErrorMsg(Error.Update);
        throw err;
      })
      .finally(() => {
        setProcessingId(prev => prev.filter(i => i !== todo.id));
      });
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length > 0,
    [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          isSubmiting={isSubmiting}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onAddTodo={onAddTodo}
          setErrorMsg={setErrorMsg}
          allTodosCompleted={allTodosCompleted}
          toggleAll={handleToggleAll}
        />

        <TodoList
          todos={filteredTodos}
          isLoading={isLoading}
          processingId={processingId}
          onDelete={handleOnDelete}
          onToggle={handleToggleTodo}
          onUpdate={handleUpdateTodo}
        />

        {tempTodo && <TodoItem todo={tempTodo} isSubmiting />}

        {todos.length !== 0 && (
          <TodoFooter
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompletedTodos={onDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errorMsg={errorMsg} onClose={handleErrorClose} />
    </div>
  );
};
