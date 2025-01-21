/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Errors } from './types/Errors';
import { FilterTodosBy } from './types/FilterTodosBy';
import { Error } from './components/Error/Error';
import { filterTodos } from './utils/utils';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(Errors.NoError);
  const [filterBy, setFilterBy] = useState(FilterTodosBy.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [toggleCompleteAll, setToggleCompleteAll] = useState(false);
  const [isHeaderDisabled, setIsHeaderDisabled] = useState(false);
  const [tempIdCounter, setTempIdCounter] = useState(0);
  const [deletingCardId, setDeletingCardId] = useState<number | null>(null);

  useEffect(() => {
    setHasError(Errors.NoError);

    const getAllTodos = async () => {
      try {
        const response = await getTodos();

        setTodos(response);
      } catch {
        setHasError(Errors.UnableToLoad);
      }
    };

    getAllTodos();
  }, []);

  const filteredTodos = filterTodos(todos, filterBy);

  const uncompletedTodosLength = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodosLength = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setHasError(Errors.NoError);

      if (!title.trim()) {
        setHasError(Errors.TitleEmpty);

        return;
      }

      const newTodo = {
        userId: 0,
        title: title.trim(),
        completed: false,
      };

      setTempTodo({ ...newTodo, id: tempIdCounter });
      setIsHeaderDisabled(true);

      try {
        const addNewTodo = await addTodo(newTodo);

        setTodos(prevTodos => [...prevTodos, addNewTodo]);
        setIsHeaderDisabled(false);
        setTitle('');
        setTempTodo(null);
        setTempIdCounter(tempIdCounter + 1);

        inputRef.current?.focus();
      } catch {
        setHasError(Errors.UnableToAdd);
        setTempTodo(null);
        setIsHeaderDisabled(false);
      }
    },
    [tempIdCounter, title],
  );

  const handleDeleteAllCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);
        setTodos(currTodos =>
          currTodos.filter(currTodo => currTodo.id !== todo.id),
        );
      } catch (error) {
        setHasError(Errors.UnableToDelete);
      }
    }
  }, [todos]);

  const handleUpdateToCompleteAll = useCallback(async () => {
    setIsUpdating(true);
    setUpdatingTodoId(null);
    setToggleCompleteAll(true);

    const areAllTodosCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed === areAllTodosCompleted,
    );

    try {
      const updatePromises = todosToUpdate.map(todo =>
        updateTodo(todo.id, {
          title: todo.title,
          completed: !areAllTodosCompleted,
          userId: todo.userId,
        }),
      );

      await Promise.all(updatePromises);

      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed: todosToUpdate.some(t => t.id === todo.id)
          ? !areAllTodosCompleted
          : todo.completed,
      }));

      setTodos(updatedTodos);

      setToggleCompleteAll(false);
      setIsUpdating(false);
      setUpdatingTodoId(null);
    } catch {
      setHasError(Errors.UnableToUpdate);
      setIsUpdating(false);
      setUpdatingTodoId(null);
      setToggleCompleteAll(true);
    }
  }, [todos]);

  const handleDelete = useCallback(
    async (todoId: number) => {
      setIsDeleting(true);
      setDeletingCardId(todoId);

      try {
        await deleteTodo(todoId);
        setIsDeleting(false);
        setDeletingCardId(null);
        setTodos(todos.filter(todo => todo.id !== todoId));
        setDeletingCardId(null);
        inputRef.current?.focus();
      } catch {
        setHasError(Errors.UnableToDelete);
        setIsDeleting(false);
        setDeletingCardId(null);
      }
    },
    [todos],
  );

  const handleComplete = useCallback(
    async (currentTodo: Todo) => {
      const currTodo = todos.find(todo => todo.id === currentTodo.id);

      setIsUpdating(true);
      setUpdatingTodoId(currentTodo.id);

      try {
        if (currTodo) {
          await updateTodo(currTodo.id, {
            title: currTodo.title,
            completed: !currTodo.completed,
            userId: currTodo.userId,
          });

          const updatedTodos = todos.map(todo =>
            todo.id === currTodo.id
              ? { ...todo, completed: !currTodo.completed }
              : todo,
          );

          setIsUpdating(false);
          setTodos(updatedTodos);
        }
      } catch {
        setIsUpdating(false);
        setHasError(Errors.UnableToUpdate);
      }
    },
    [todos],
  );

  return (
    <div className="todoapp">
      <div className="todoapp__content">
        <h1 className="todoapp__title">todos</h1>
        <Header
          title={title}
          setTitle={setTitle}
          todos={todos}
          inputRef={inputRef}
          isHeaderDisabled={isHeaderDisabled}
          handleSubmit={handleSubmit}
          handleUpdateToCompleteAll={handleUpdateToCompleteAll}
        />
        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          isDeleting={isDeleting}
          setTodos={setTodos}
          setHasError={setHasError}
          initialTodos={todos}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
          updatingTodoId={updatingTodoId}
          setUpdatingTodoId={setUpdatingTodoId}
          toggleCompleteAll={toggleCompleteAll}
          handleDelete={handleDelete}
          deletingCardId={deletingCardId}
          handleComplete={handleComplete}
        />

        {todos.length > 0 && (
          <Footer
            uncompletedTodosLength={uncompletedTodosLength}
            filterBy={filterBy}
            setFilteredBy={setFilterBy}
            completedTodosLenght={completedTodosLength}
            handleDeleteAllCompleted={handleDeleteAllCompleted}
          />
        )}
      </div>
      <Error hasError={hasError} setHasError={setHasError} />
    </div>
  );
};
