/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import {
  createTodo, deleteTodo, getTodo, getTodos, updateTodo,
  // eslint-disable-next-line import/extensions
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { NewTodoForm } from './components/NewTodoForm';
import { FormMain } from './components/FormMain';
import { FormFooter } from './components/FormFooter';
import { FormErrors } from './components/FormErrors';

const USER_ID = 6146;

enum Filters {
  Active = 'active',
  Completed = 'completed',
  All = 'all',
}

enum ErrorMessage {
  Loading = 'Unable to load todos',
  Adding = 'Unable to add todo',
  Deleting = 'Unable to delete todo',
  Updating = 'Unable to update todo',
  Empty = 'Title cant be empty',
}

export const App: React.FC = () => {
  const [processedTodos, setProcessedTodos] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(true);
        setErrorMsg(ErrorMessage.Loading);

        setTimeout(() => {
          setError(false);
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (todo) {
      getTodo(todo.id).then(setTodo);
    }
  }, [todo]);

  const addTodo = (todoData: Omit<Todo, 'id'>) => {
    if (todoData.title !== '') {
      setProcessedTodos(prev => [...prev, 0]);
      setTodos([...todos, {
        id: 0,
        title: todoData.title,
        completed: false,
        userId: USER_ID,
      }]);
      createTodo(todoData)
        .then(newTodo => setTodos([...todos, newTodo]))
        .catch(() => setErrorMsg(ErrorMessage.Adding))
        .finally(() => {
          setTodos(prev => prev.filter(td => td.id !== 0));
        });
    } else {
      setError(true);
      setErrorMsg(ErrorMessage.Empty);
      setTimeout(() => {
        setError(false);
        setErrorMsg('');
      }, 3000);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo({
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    });

    setNewTodoTitle('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter((td) => {
    switch (filter) {
      case Filters.Active:
        return !td.completed;
      case Filters.Completed:
        return td.completed;
      default:
        return true;
    }
  });

  const removeTodo = (todoId: number) => {
    setProcessedTodos(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos) => currentTodos.filter(td => td.id !== todoId));
      })
      .catch(() => {
        setErrorMsg(ErrorMessage.Deleting);
        setTimeout(() => {
          setErrorMsg('');
        }, 3000);
      })
      .finally(() => {
        processedTodos.filter(id => id !== todoId);
      });
  };

  const todoUpdate = (todoToUpdate: Todo) => {
    setProcessedTodos(prev => [...prev, todoToUpdate.id]);

    updateTodo(todoToUpdate)
      .then(() => {
        setTodos(
          current => current.map(td => {
            if (td.id === todoToUpdate.id) {
              return todoToUpdate;
            }

            return td;
          }),
        );
      })
      .catch(() => {
        setErrorMsg(ErrorMessage.Updating);
        setTimeout(() => {
          setErrorMsg('');
        }, 3000);
      })
      .finally(() => {
        setProcessedTodos(prev => prev.filter(id => id !== todoToUpdate.id));
      });
  };

  const completedTodos = todos.filter(td => td.completed);
  const clearCompleted = () => {
    completedTodos.forEach(td => {
      removeTodo(td.id);
    });
  };

  const hasActiveTodo = todos.some(td => td.completed);

  const handleToggleAll = () => {
    todos.forEach(td => {
      todoUpdate({ ...td, completed: !hasActiveTodo });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoForm
          onSubmit={handleSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          allCompleted={completedTodos.length === todos.length}
          onhandleToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <>
            <FormMain
              todoTobeEdited={todo}
              todos={visibleTodos}
              onRemove={removeTodo}
              onTodoUpdate={todoUpdate}
              processedTodos={processedTodos}
            />

            <FormFooter
              todos={todos}
              filter={filter}
              setFilter={setFilter}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {error && (
        <FormErrors errorMsg={errorMsg} error={error} setError={setError} />)}
    </div>
  );
};
