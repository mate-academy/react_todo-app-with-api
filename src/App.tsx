/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
import { FilterParams } from './types/messages';
import { ErrorMessages } from './types/messages';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  const [data, setData] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [todoInOperation, setTodoInOperation] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterParams>(FilterParams.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  const previousActiveCountRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const addOperation = (id: number) => {
    setTodoInOperation(prev => [...prev, id]);
  };

  const removeOperation = (id: number) => {
    setTodoInOperation(prev => prev.filter(todoId => todoId !== id));
  };

  useEffect(() => {
    if (todoInOperation.length === 0 && !isEdited) {
      inputRef.current?.focus();
    }
  }, [todoInOperation, isEdited]);

  useEffect(() => {
    setErrorMessage(ErrorMessages.None);
    getTodos()
      .then(setData)
      .catch(() => setErrorMessage(ErrorMessages.OnGet));
  }, []);

  useEffect(() => {
    if (errorMessage !== ErrorMessages.None) {
      const timer = setTimeout(() => {
        setErrorMessage(ErrorMessages.None);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const filteredTodos = data.filter(todo => {
    switch (filter) {
      case FilterParams.Active:
        return !todo.completed;
      case FilterParams.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleEditClick(id: number) {
    setEditingId(id);
    setNewTitle(data.find(todo => todo.id === id)?.title || '');
    setIsEdited(true);
  }

  const createTodo = () => {
    if (newTodoTitle.trim() === '') {
      setErrorMessage(ErrorMessages.OnEmptyTitle);

      return;
    }

    const newTodoData = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    previousActiveCountRef.current = data.filter(
      todo => !todo.completed,
    ).length;

    const tempTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    addOperation(0);
    setData(currentTodos => [...currentTodos, tempTodo]);

    postService
      .createTodo(newTodoData)
      .then(newTodo => {
        setData(currentTodos =>
          currentTodos.map(todo => (todo.id === 0 ? newTodo : todo)),
        );
        setNewTodoTitle('');
      })
      .catch(() => {
        setData(currentTodos => currentTodos.filter(todo => todo.id !== 0));
        setErrorMessage(ErrorMessages.OnPost);
      })
      .finally(() => {
        removeOperation(0);
        inputRef.current?.focus();
      });
  };

  const deleteCompletedTodos = () => {
    const completedTodos = data.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    completedIds.forEach(addOperation);

    const deletePromises = completedIds.map(id =>
      postService.deleteTodo(id).then(() => id),
    );

    Promise.allSettled(deletePromises)
      .then(results => {
        const successIds = results
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value as number);

        const isSomeFailed = results.some(
          result => result.status === 'rejected',
        );

        if (isSomeFailed) {
          setErrorMessage(ErrorMessages.OnDelete);
        }

        setData(currentTodos =>
          currentTodos.filter(todo => !successIds.includes(todo.id)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.OnDelete);
      })
      .finally(() => {
        completedIds.forEach(removeOperation);
      });
  };

  const deleteTodo = (id: number) => {
    addOperation(id);

    postService
      .deleteTodo(id)
      .then(() => {
        setData(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.OnDelete);
      })
      .finally(() => {
        removeOperation(id);
        inputRef.current?.focus();
      });
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  function updateTodo(todo: Todo) {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      deleteTodo(todo.id);

      return;
    }

    addOperation(todo.id);

    postService
      .updateTodo(todo)
      .then((updatedTodo: Todo) => {
        setData(currentTodos =>
          currentTodos.map(existingTodo =>
            existingTodo.id === updatedTodo.id ? updatedTodo : existingTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.OnPatch);
        setIsEdited(true);
      })
      .finally(() => {
        removeOperation(todo.id);
        inputRef.current?.focus();
      });
  }

  function keepEditingOnError(id: number) {
    setIsEdited(true);
    setEditingId(id);
  }

  function handleBlurOrKeyDown(
    e: /* eslint-disable @typescript-eslint/no-unused-vars */
    React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
    id: number,
  ) {
    const newEditedTitle = e.currentTarget.value.trim();

    if (e.type === 'blur' || (e as React.KeyboardEvent).key === 'Enter') {
      const currentTodo = data.find(todoItem => todoItem.id === id);

      if (currentTodo) {
        if (newEditedTitle === '') {
          addOperation(currentTodo.id);

          postService
            .deleteTodo(currentTodo.id)
            .then(() => {
              setData(currentTodos =>
                currentTodos.filter(item => item.id !== currentTodo.id),
              );
              setIsEdited(false);
              setEditingId(null);
            })
            .catch(() => {
              setErrorMessage(ErrorMessages.OnDelete);
              keepEditingOnError(currentTodo.id);
            })
            .finally(() => {
              removeOperation(currentTodo.id);
            });
        } else if (currentTodo.title !== newEditedTitle) {
          const updatedTodo = { ...currentTodo, title: newEditedTitle };

          addOperation(currentTodo.id);

          postService
            .updateTodo(updatedTodo)
            .then((editedTodo: Todo) => {
              setData(currentTodos =>
                currentTodos.map(existingTodo =>
                  existingTodo.id === editedTodo.id ? editedTodo : existingTodo,
                ),
              );
              setIsEdited(false);
              setEditingId(null);
            })
            .catch(() => {
              setErrorMessage(ErrorMessages.OnPatch);
              keepEditingOnError(currentTodo.id);
            })
            .finally(() => {
              removeOperation(currentTodo.id);
            });

          return;
        } else {
          setIsEdited(false);
          setEditingId(null);
        }
      }
    } else if ((e as React.KeyboardEvent).key === 'Escape') {
      setIsEdited(false);
      setEditingId(null);
    }
  }

  const handleToggle = (id: number) => {
    addOperation(id);

    const todo = data.find(findedTodo => findedTodo.id === id);

    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };

      postService
        .updateTodo(updatedTodo)
        .then((editedTodo: Todo) => {
          setData(currentTodos =>
            currentTodos.map(existingTodo =>
              existingTodo.id === editedTodo.id ? editedTodo : existingTodo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.OnPatch);
        })
        .finally(() => {
          removeOperation(id);
          inputRef.current?.focus();
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEnterKey = e.key === 'Enter';

    if (isEnterKey) {
      e.preventDefault();
      createTodo();
    }
  };

  const allCompleted = data.every(todo => todo.completed);

  const toggleAllTodos = () => {
    const shouldBeCompleted = !allCompleted;

    const todosToUpdate = data.filter(
      todo => todo.completed !== shouldBeCompleted,
    );

    todosToUpdate.forEach(todo => {
      const updatedTodo = { ...todo, completed: shouldBeCompleted };

      addOperation(todo.id);

      postService
        .updateTodo(updatedTodo)
        .then(updated => {
          setData(currentTodos =>
            currentTodos.map(current =>
              current.id === updated.id ? updated : current,
            ),
          );
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.OnPatch);
        })
        .finally(() => {
          removeOperation(todo.id);
        });
    });
  };

  const disabledButton = data.filter(todo => todo.completed).length === 0;

  const itemsLeft =
    todoInOperation.length > 0
      ? previousActiveCountRef.current
      : data.filter(filteredTodo => !filteredTodo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          data={data}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handleKeyDown={handleKeyDown}
          todoInOperation={todoInOperation}
          isEdited={isEdited}
          inputRef={inputRef}
          toggleAllTodos={toggleAllTodos}
        />

        {data.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            handleToggle={handleToggle}
            handleEditClick={handleEditClick}
            deleteTodo={deleteTodo}
            isEdited={isEdited}
            editingId={editingId}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            handleBlurOrKeyDown={handleBlurOrKeyDown}
            todoInOperation={todoInOperation}
            inputRef={inputRef}
          />
        )}

        {data.length > 0 && (
          <TodoFooter
            itemsLeft={itemsLeft}
            setFilter={setFilter}
            filter={filter}
            disabledButton={disabledButton}
            deleteCompletedTodos={deleteCompletedTodos}
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
