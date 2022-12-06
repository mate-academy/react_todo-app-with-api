import {
  FormEvent,
  useContext, useEffect, useRef, useState,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import { TodoList } from './TodoList';
import { getTodos, postTodo } from '../api/todos';
import { AuthContext } from './Auth/AuthContext';
import { Footer } from './Footer';
import { Todo } from '../types/Todo';
import { ToggleAllButton } from './ToggleAllButton';
import { ErrorContext } from './ErrorContext';

export const TodoContent = () => {
  const {
    hasLoadingError,
    setHasLoadingError,
    setIsEmptyTitleErrorShown,
    setIsRemoveErrorShown,
    setIsTogglingErrorShown,
    setIsAddingErrorShown,
  } = useContext(ErrorContext);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [isNewTodoLoaded, setIsNewTodoLoaded] = useState(true);
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [
    isCompletedTodosDeleting, setIsCompletedTodosDeleting,
  ] = useState(false);
  const [areTodosToggling, setAreTodosToggling] = useState(false);

  const isContentRendered = todos.length > 0;

  function setErrorsToFalseExceptLoadingError() {
    setIsEmptyTitleErrorShown(false);
    setIsRemoveErrorShown(false);
    setIsTogglingErrorShown(false);
    setIsAddingErrorShown(false);

    setHasLoadingError(true);
  }

  function setErrorsToFalseExceptEmptyTitleError() {
    setHasLoadingError(false);
    setIsTogglingErrorShown(false);
    setIsRemoveErrorShown(false);
    setIsAddingErrorShown(false);

    setIsEmptyTitleErrorShown(true);
  }

  function setErrorsToFalseExceptAddingError() {
    setHasLoadingError(false);
    setIsTogglingErrorShown(false);
    setIsRemoveErrorShown(false);
    setIsEmptyTitleErrorShown(false);

    setIsAddingErrorShown(true);
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    if (newTodoField.current && hasLoadingError) {
      newTodoField.current.focus();
    }

    getTodos(user.id)
      .then((fetchedTodos) => {
        setVisibleTodos(fetchedTodos);
      })
      .catch(() => {
        setErrorsToFalseExceptLoadingError();
      });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id).then(fetchedTodos => setTodos(fetchedTodos));
  }, [visibleTodos]);

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClickedIndex(visibleTodos.length);
    const inputValue = newTodoField?.current?.value;

    if (inputValue?.length === 0) {
      setErrorsToFalseExceptEmptyTitleError();

      return;
    }

    setIsNewTodoLoaded(false);

    const newTodoObj = {
      title: newTodoField.current?.value.trim() || '',
      userId: user?.id || 0,
      completed: false,
      id: 0,
    };

    setVisibleTodos(prev => [...prev, newTodoObj]);
    setTodos(visibleTodos);

    if (user && newTodoField.current) {
      postTodo(user.id, newTodoObj)
        .then(data => {
          setIsAddingErrorShown(false);

          setVisibleTodos((prev: Todo[]) => {
            setIsNewTodoLoaded(true);
            const prevArr = prev.slice(0, -1);

            return [...prevArr, data];
          });
        })
        .catch(() => {
          setErrorsToFalseExceptAddingError();

          setVisibleTodos(prev => prev.slice(0, prev.length - 1));
          setTodos(visibleTodos);
        });

      newTodoField.current.value = '';
    }
  }

  return (
    <div className="todoapp__content">
      <header className="todoapp__header">
        {visibleTodos.length > 0 && (
          <ToggleAllButton
            visibleTodos={visibleTodos}
            setVisibleTodos={setVisibleTodos}
            setAreTodosToggling={setAreTodosToggling}
          />
        )}

        <form
          onSubmit={onSubmitHandler}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
          />
        </form>
      </header>

      <TodoList
        visibleTodos={visibleTodos}
        setVisibleTodos={setVisibleTodos}
        isNewTodoLoaded={isNewTodoLoaded}
        clickedIndex={clickedIndex}
        setClickedIndex={setClickedIndex}
        isCompletedTodosDeleting={isCompletedTodosDeleting}
        areTodosToggling={areTodosToggling}
      />

      <CSSTransition
        in={isContentRendered}
        timeout={100}
        classNames="footer"
      >
        <Footer
          setVisibleTodos={setVisibleTodos}
          visibleTodos={visibleTodos}
          todos={todos}
          setIsCompletedTodosDeleting={setIsCompletedTodosDeleting}
        />
      </CSSTransition>
    </div>
  );
};
