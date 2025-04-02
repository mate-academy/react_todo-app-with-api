/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as todoServices from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterBy } from './types/FilterBy';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Errors } from './types/Errors';
import { ErrorNotification } from './components/ErrorNotification';

function filterTodos(todos: Todo[], show: string) {
  switch (show) {
    case FilterBy.Active: {
      return todos.filter(todo => !todo.completed);
    }

    case FilterBy.Completed: {
      return todos.filter(todo => todo.completed);
    }

    case FilterBy.All:

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(Errors.No_Error);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [isLoadedIDs, setIsLoadedIDs] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const isFocusAddFormTrigger = useRef(false);

  useEffect(() => {
    isFocusAddFormTrigger.current = false;
  });

  useEffect(() => {
    todoServices
      .getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(Errors.Load);
      });
  }, []);

  const filteredTodos = useMemo(
    () => filterTodos(todos, filterBy),
    [todos, filterBy],
  );

  const handleDeleteTodo = useCallback((todoId: number) => {
    return todoServices
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage(Errors.Delete);
        throw new Error(error);
      })
      .finally(() => {
        setIsLoadedIDs((loadingIDs: number[]) => {
          const stilLoadingIDs = [...loadingIDs];

          stilLoadingIDs.pop();

          return stilLoadingIDs;
        });
        isFocusAddFormTrigger.current = true;
      });
  }, []);

  const handleDeleteCompletedTodo = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      setIsLoadedIDs((alreadyLoadedIDs: number[]) => [
        ...alreadyLoadedIDs,
        todo.id,
      ]);
      handleDeleteTodo(todo.id);
    });
  }, [todos]);

  const handleAddTodo = useCallback((todoTitle: string) => {
    const newTodoToAdd = {
      userId: todoServices.USER_ID,
      title: todoTitle.trim(),
      completed: false,
      id: 0,
    };

    setTempTodo(newTodoToAdd);
    setErrorMessage(Errors.No_Error);

    return todoServices
      .addTodo(newTodoToAdd)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage(Errors.Add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        isFocusAddFormTrigger.current = true;
      });
  }, []);

  const handleChangeCompleted = useCallback((todoToChange: Todo) => {
    const changedTodo = { ...todoToChange, completed: !todoToChange.completed };

    todoServices
      .updateTodo(changedTodo)
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(() => {
        setErrorMessage(Errors.Update);
      })
      .finally(() => {
        setIsLoadedIDs((loadingIDs: number[]) => {
          const stilLoadingIDs = [...loadingIDs];

          stilLoadingIDs.pop();

          return stilLoadingIDs;
        });
      });
  }, []);

  const handleChangeAllIsCompleted = useCallback(() => {
    if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => {
        setIsLoadedIDs((alreadyLoadedIDs: number[]) => [
          ...alreadyLoadedIDs,
          todo.id,
        ]);
        handleChangeCompleted(todo);
      });

      return;
    }

    const uncompletedTodos = todos.filter(todo => !todo.completed);

    uncompletedTodos.forEach(todo => {
      setIsLoadedIDs((alreadyLoadedIDs: number[]) => [
        ...alreadyLoadedIDs,
        todo.id,
      ]);
      handleChangeCompleted(todo);
    });
  }, [todos]);

  const handleChangeTodo = useCallback(
    (todoToChange: Todo, newTodoTitle: string) => {
      const changedTodo = { ...todoToChange, title: newTodoTitle };

      return todoServices
        .updateTodo(changedTodo)
        .then(updatedTodo => {
          setTodos(currentTodos => {
            return currentTodos.map(todo =>
              todo.id === updatedTodo.id ? updatedTodo : todo,
            );
          });
        })
        .catch(error => {
          setErrorMessage(Errors.Update);
          throw new Error(error);
        })
        .finally(() => {
          setIsLoadedIDs((loadingIDs: number[]) => {
            const stilLoadingIDs = [...loadingIDs];

            stilLoadingIDs.pop();

            return stilLoadingIDs;
          });
        });
    },
    [],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={handleAddTodo}
          setNewError={setErrorMessage}
          changeAllIsComplated={handleChangeAllIsCompleted}
          isFocusAddForm={isFocusAddFormTrigger.current}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={handleDeleteTodo}
          isLoadedIDs={isLoadedIDs}
          setIsLoadedIDs={setIsLoadedIDs}
          tempTodo={tempTodo}
          changeCompleted={handleChangeCompleted}
          changeTodo={handleChangeTodo}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteCompleted={handleDeleteCompletedTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
