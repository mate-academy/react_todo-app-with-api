/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.TitleEmpty);
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    });

    const newTodo = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    addTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);

        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    setProcessingIds(current => [...current, todoId]);

    // prettier-ignore
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId)
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todoId));
        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      });
  };

  const handleToggleAll = () => {
    const shouldBeCompleted = todos.some(todo => !todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldBeCompleted,
    );

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setProcessingIds(current => [...current, ...idsToUpdate]);

    Promise.all(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { ...todo, completed: shouldBeCompleted }),
      ),
    )
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => ({
            ...todo,
            completed: shouldBeCompleted,
          })),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(id => !idsToUpdate.includes(id)),
        );
      });
  };

  const handleToggle = (todoToUpdate: Todo) => {
    setErrorMessage('');
    setProcessingIds(current => [...current, todoToUpdate.id]);

    updateTodo(todoToUpdate.id, { completed: !todoToUpdate.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoToUpdate.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(id => id !== todoToUpdate.id),
        );
      });
  };

  const handleClearCompleted = () => {
    setErrorMessage('');
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setProcessingIds(current => [...current, ...completedIds]);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id).then(() => {
        setTodos(current => current.filter(t => t.id !== todo.id));
      }),
    );

    Promise.all(deletePromises)
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(id => !completedIds.includes(id)),
        );
        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      });
  };

  const handleEdit = (todo: Todo) => {
    setEditedTodo(todo);
    setTempTitle(todo.title);
  };

  const saveTitle = (todo: Todo) => {
    if (tempTitle === todo.title) {
      setEditedTodo(null);

      return;
    }

    if (!tempTitle.trim()) {
      setProcessingIds(current => [...current, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(current => current.filter(t => t.id !== todo.id));
          setEditedTodo(null);
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.Delete);
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => {
          setProcessingIds(current => current.filter(id => id !== todo.id));
        });

      return;
    }

    setProcessingIds(current => [...current, todo.id]);

    updateTodo(todo.id, { title: tempTitle.trim() })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
        setEditedTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todo.id));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      case FilterType.All:
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          disabled={isSubmitting}
          inputRef={newTodoFieldRef}
          todosCount={todos.length}
          activeTodosCount={todos.filter(todo => !todo.completed).length}
          handleToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              processingIds={processingIds}
              editedTodo={editedTodo}
              tempTitle={tempTitle}
              setTempTitle={setTempTitle}
              handleToggle={handleToggle}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              saveTitle={saveTitle}
              tempTodo={tempTodo}
              setEditedTodo={setEditedTodo}
            />

            <TodoFooter
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
