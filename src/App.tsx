import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FilterStatusType, Todo } from './types/Type';
import { errorMessages, ErrorMessages } from './types/err';
import * as tadoService from './api/todos';
import { ListComponent } from './component/ListComponent';
import { Footer } from './component/Footer';
import { Error } from './component/Error';
import { Header } from './component/Header';

function filterTodos(todos: Todo[], filter: FilterStatusType) {
  switch (filter) {
    case FilterStatusType.All:
      return todos;
    case FilterStatusType.Active:
      return todos.filter(todo => !todo.completed);
    case FilterStatusType.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterStatusType>(
    FilterStatusType.All,
  );
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoadingTodos, setIsLoadingTodo] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleError = (message: ErrorMessages) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    tadoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(errorMessages.load);
      });
  }, []);

  const handleDelete = (todoId: number) => {
    setIsLoadingTodo(prev => [...prev, todoId]);

    if (inputRef.current) {
      inputRef.current.focus();
    }

    tadoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleError(errorMessages.delete);
      })
      .finally(() => {
        setIsLoadingTodo(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleAddTodo = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (query.trim() === '') {
        handleError('Title should not be empty');

        return;
      }

      const newTodo = {
        title: query.trim(),
        completed: false,
        userId: tadoService.USER_ID,
      };

      const tempTado = {
        id: 0,
        ...newTodo,
      };

      setTempTodo(tempTado);

      setIsLoading(true);

      tadoService
        .addTodos(newTodo)
        .then(newTodos => {
          setTodos(currentPosts => [...currentPosts, newTodos]);
          setQuery('');
        })
        .catch(() => {
          handleError(errorMessages.add);
        })
        .finally(() => {
          setIsLoading(false);
          setTempTodo(null);
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 0);
        });
    }
  };

  const updateCompleted = (todoId: number, completed: boolean) => {
    setIsLoadingTodo(prev => [...prev, todoId]);
    const completedObject = { completed: !completed };

    tadoService
      .updateCompletedTodos(todoId, completedObject)
      .then(() =>
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !completed } : todo,
          ),
        ),
      )
      .catch(() => {
        handleError(errorMessages.update);
      })
      .finally(() => {
        setIsLoadingTodo(prev => prev.filter(id => id !== todoId));
      });
  };

  const tasks = filterTodos(todos, filterBy);

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteAllCompleted = () => {
    completedTodos.forEach(todo => handleDelete(todo.id));
  };

  const updateTitle = (todoId: number, newTitle: string): Promise<Todo> => {
    const updateTitleObject = { title: newTitle };

    setIsLoadingTodo(prev => [...prev, todoId]);

    return tadoService
      .updateTitleTodos(todoId, updateTitleObject)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? { ...todo, title: newTitle } : todo,
          ),
        );

        return updatedTodo;
      })
      .catch(error => {
        handleError(errorMessages.update);
        throw error;
      })
      .finally(() => {
        setIsLoadingTodo(prev => prev.filter(id => id !== todoId));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleQueryChange={handleQueryChange}
          updateCompleted={updateCompleted}
          query={query}
          handleAddTodo={handleAddTodo}
          inputRef={inputRef}
          isLoading={isLoading}
        />

        <ListComponent
          todos={tasks}
          handleDelete={handleDelete}
          isLoadingTodos={isLoadingTodos}
          isLoading={isLoading}
          tempTodo={tempTodo}
          updateCompleted={updateCompleted}
          updateTitle={updateTitle}
        />
        {todos.length > 0 && (
          <Footer
            onClearCompleted={deleteAllCompleted}
            setFilterBy={setFilterBy}
            todos={todos}
            filterBy={filterBy}
          />
        )}
      </div>
      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
