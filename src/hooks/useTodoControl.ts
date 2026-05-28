import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Filters, Todo } from '../types/Todo';
import { Errors } from '../types/Errors';
import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos';

export function useTodoControl() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filters>(Filters.all);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const newTodoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.UnableLoad))
      .finally();
  }, []);
  function getFilteredTodos(allTodos: Todo[]) {
    let filteredTodos = [...allTodos];

    filteredTodos = filteredTodos.filter(todo => {
      switch (filterBy) {
        case Filters.active:
          return !todo.completed;
        case Filters.completed:
          return todo.completed;
        default:
          return true;
      }
    });

    return filteredTodos;
  }

  function getActiveTodos(allTodos: Todo[]) {
    return allTodos.filter(todo => !todo.completed);
  }

  const filteredTodos = getFilteredTodos(todos);
  const activeTodos = getActiveTodos(todos);
  const isAllCompleted = activeTodos.length === 0;
  const completedTodos = todos.length - activeTodos.length;
  const isDisabled = completedTodos < 1;
  const isShowHeaderAndFooter = todos.length > 0;
  const activeTodosLength = activeTodos.length;

  const handleEditTodo = useCallback((id: number, body: Partial<Todo>) => {
    setProcessingIds(current => [...current, id]);

    return patchTodo(id, body)
      .then(newTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (todo.id === newTodo.id) {
              return newTodo;
            }

            return todo;
          }),
        );
      })
      .catch(error => {
        setErrorMessage(Errors.UnableUpdate);
        throw error;
      })
      .finally(() => {
        setProcessingIds(current => current.filter(item => item !== id));
      });
  }, []);

  const handleDeleteTodo = useCallback((id: number) => {
    setProcessingIds(current => [...current, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(Errors.UnableDelete);
      })
      .finally(() => {
        setProcessingIds(current => current.filter(item => item !== id));
        newTodoTitleRef.current?.focus();
      });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const normalizedTitle = newTitle.trim();

      if (!normalizedTitle) {
        setErrorMessage(Errors.EmptyTitle);

        return;
      }

      setTempTodo({
        id: 0,
        title: normalizedTitle,
        completed: false,
        userId: 0,
      });

      if (newTodoTitleRef.current) {
        newTodoTitleRef.current.disabled = true;
      }

      createTodo(normalizedTitle)
        .then(todo => {
          setTodos(current => [...current, todo]);
          setNewTitle('');
        })
        .catch(() => setErrorMessage(Errors.UnableAdd))
        .finally(() => {
          setTempTodo(null);
          if (newTodoTitleRef.current) {
            newTodoTitleRef.current.disabled = false;
          }

          newTodoTitleRef.current?.focus();
        });
    },
    [newTitle],
  );

  const handleMassiveDelete = useCallback(() => {
    for (const todo of todos) {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    }
  }, [handleDeleteTodo, todos]);

  const handleMassiveEditStatus = () => {
    for (const todo of todos) {
      if (todo.completed === isAllCompleted) {
        handleEditTodo(todo.id, { completed: !isAllCompleted });
      }
    }
  };

  return {
    isShowHeaderAndFooter,
    handleMassiveEditStatus,
    isAllCompleted,
    handleSubmit,
    newTitle,
    setNewTitle,
    filteredTodos,
    processingIds,
    tempTodo,
    newTodoTitleRef,
    handleDeleteTodo,
    errorMessage,
    setErrorMessage,
    isDisabled,
    handleMassiveDelete,
    filterBy,
    activeTodosLength,
    setFilterBy,
    handleEditTodo,
  };
}
