import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

enum MessageOfError {
  todosLoadError = 'Something went wrong while loading todos',
  todosAddError =
  'Something went wrong while adding a todo. Please, try again later',
  emptyTitleError = 'Title can\'t be empty',
  todoDeletingError =
  'Something went wrong while deleting a todo. Please, try again later',
  todosUpdateError = 'Something went wrong while updating todo',
  invalidTypeError = 'Invalid type',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [isTodoUpdating, setIsTodoUpdating] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const loadTodos = async () => {
    if (!user) {
      return;
    }

    try {
      setErrorMessage('');
      const loadedTodos = await getTodos(user.id);

      setTodos(loadedTodos);
    } catch (error) {
      setErrorMessage(MessageOfError.todosLoadError);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodoOnServer = async () => {
    setIsAdding(true);

    if (user) {
      try {
        setTempTodo({
          id: 0,
          userId: user?.id,
          title: title.trim(),
          completed: false,
        });

        const newTodo = await addTodo({
          userId: user?.id,
          title: title.trim(),
          completed: false,
        });

        setTitle('');

        setTodos(current => [
          ...current,
          {
            id: newTodo.id,
            userId: newTodo.userId,
            title: newTodo.title,
            completed: newTodo.completed,
          },
        ]);
      } catch (error) {
        // eslint-disable-next-line max-len
        setErrorMessage(MessageOfError.todosAddError);
      } finally {
        setIsAdding(false);
        setTempTodo(null);
      }
    }
  };

  const handleSubmitForm = useCallback((
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    if (!event) {
      return;
    }

    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(MessageOfError.emptyTitleError);

      return;
    }

    addTodoOnServer();
  }, [title]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setIsDeleting(true);
      setSelectedTodoIds(todosIds => [
        ...todosIds,
        todoId,
      ]);

      setErrorMessage('');

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      setSelectedTodoIds(todosIds => todosIds.filter(id => id !== todoId));
    } catch (error) {
      // eslint-disable-next-line max-len
      setErrorMessage(MessageOfError.todoDeletingError);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const removeCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const editTodo = useCallback(async (
    todoId: number,
    dataToUpdate: Partial<Todo>,
  ) => {
    try {
      setIsTodoUpdating(true);
      setErrorMessage('');
      setSelectedTodoIds(todoIds => [
        ...todoIds,
        todoId,
      ]);

      await updateTodo(todoId, dataToUpdate);

      setTodos(currentTodos => currentTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          ...dataToUpdate,
        };
      }));
    } catch (error) {
      setErrorMessage(MessageOfError.todosUpdateError);
    } finally {
      setSelectedTodoIds([]);
      setIsTodoUpdating(false);
    }
  }, []);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const updateAllTodos = useCallback(() => {
    todos.forEach(todo => {
      const isTodoNeedToUpdate = !isAllTodosCompleted && !todo.completed;

      if (isTodoNeedToUpdate || isAllTodosCompleted) {
        editTodo(todo.id, { completed: !todo.completed });
      }
    });
  }, [todos, isAllTodosCompleted]);

  const filteredTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.All:
        return todos;

      case FilterType.Active:
        return todos.filter(todo => !todo.completed);

      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        throw new Error(MessageOfError.invalidTypeError);
    }
  }, [todos, filterType]);

  const activeTodosAmount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const hasCompletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          isAdding={isAdding}
          changeInput={setTitle}
          submitForm={handleSubmitForm}
          isAllTodosCompleted={isAllTodosCompleted}
          updateAllTodos={updateAllTodos}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isDeleting={isDeleting}
              isTodoUpdating={isTodoUpdating}
              newTodoField={newTodoField}
              selectedTodoIds={selectedTodoIds}
              updateTodo={editTodo}
              deleteTodo={removeTodo}
            />

            <Footer
              activeTodosAmount={activeTodosAmount}
              hasCompletedTodos={hasCompletedTodos}
              filterType={filterType}
              changeFilterType={setFilterType}
              deleteCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorMessage
        error={errorMessage}
        handleSetErrorMessage={setErrorMessage}
      />
    </div>
  );
};
