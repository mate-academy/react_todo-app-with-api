/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo, useCallback, useRef,
} from 'react';
import {
  getTodos, deleteTodo, addTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoItem } from './components/TodoItem';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

function filterTodos(todos: Todo[], filterField: FilterType) {
  let filteredTodos = todos;

  if (filterField !== FilterType.All) {
    switch (filterField) {
      case FilterType.Completed: {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;
      }

      case FilterType.Active: {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;
      }

      default:
        throw new Error('Unable to filter todos');
    }
  }

  return filteredTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterField, setFilterField] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoAdding, setIsTodoAdding] = useState(false);

  const activeTodosCounter = todos.filter(todo => !todo.completed).length;
  const completedTodosCounter = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterField);
  }, [todos, filterField]);

  const handleDeleteTodo = useCallback((todoId: number) => {
    setErrorMessage('');
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos((prevState) => (
          prevState.filter(todo => todo.id !== todoId)
        ));
      })
      .catch((error) => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todoId),
        );
      });
  }, []);

  const handleAddTodo = useCallback((newTodoTitle: string) => {
    setErrorMessage('');
    setTempTodo({
      id: 0,
      title: newTodoTitle,
      userId: 0,
      completed: false,
    });

    return addTodo(newTodoTitle.trim())
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  }, []);

  const handleUpdateTodo = (todo: Todo, newTodoTitle: string) => {
    setErrorMessage('');
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todo.id]);

    updateTodo({
      id: todo.id,
      title: newTodoTitle,
      userId: todo.userId,
      completed: todo.completed,
    })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
        );
      });
  };

  const handleClearCompleted = () => {
    const compeletedTodos = todos.filter(todo => todo.completed);

    compeletedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsTodoAdding(true);
    handleAddTodo(todoTitle)
      .then(() => {
        setTodoTitle('');
      })
      .finally(() => {
        setIsTodoAdding(false);
      });
  };

  const handleToggleTodo = (todo: Todo) => {
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todo.id]);

    updateTodo({
      id: todo.id,
      title: todo.title,
      userId: todo.userId,
      completed: !todo.completed,
    })
      .then((updatedTodo) => {
        setTodos(prevState => prevState
          .map(currentTodo => (
            currentTodo.id !== updatedTodo.id
              ? currentTodo
              : updatedTodo
          )));
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
        );
      });
  };

  const handleToggleAll = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    if (activeTodosCounter === todos.length
      || completedTodosCounter === todos.length
    ) {
      todos.forEach(todo => {
        handleToggleTodo(todo);
      });
    } else {
      activeTodos.forEach(todo => {
        handleToggleTodo(todo);
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          todoTitle={todoTitle}
          onTodoTitleChange={setTodoTitle}
          onFormSubmit={handleSubmit}
          isTodoAdding={isTodoAdding}
          activeTodosCounter={activeTodosCounter}
          onToggleAll={handleToggleAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onDeleteTodo={handleDeleteTodo}
              onTodoUpdate={
                (newTodoTitle) => handleUpdateTodo(todo, newTodoTitle)
              }
              isProcessing={processingTodoIds.includes(todo.id)}
              onToggleTodo={handleToggleTodo}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isProcessing
            />
          )}
        </section>

        {todos.length !== 0 && (
          <Footer
            activeTodosCounter={activeTodosCounter}
            completedTodosCounter={completedTodosCounter}
            onFilterFieldChange={setFilterField}
            filterField={filterField}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onErrorMessageChange={setErrorMessage}
      />
    </div>
  );
};
