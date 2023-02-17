/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Errors } from './components/Errors';
import { TodoContent } from './components/TodoContent';
import { UserWarning } from './UserWarning';
import {
  getTodos, addTodo, deleteTodo, patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 6232;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [todosToDelete, setTodosToDelete] = useState<number[]>([]);
  const [focusTitleInput, setFocusTitleInput] = useState(false);
  const [inCompleteTodos, setIncompleteTodos] = useState(0);

  const filterTodos = (filterBy: Filter) => {
    setFilteredTodos(
      todos.filter((todo) => {
        switch (filterBy) {
          case Filter.active:
            return !todo.completed;

          case Filter.completed:
            return todo.completed;

          default:
            return todo;
        }
      }),
    );
  };

  const createTodo = async (title: string) => {
    setIsInputDisabled(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    await addTodo(newTodo)
      .then((response) => {
        setTempTodo(null);

        setFilteredTodos((state) => [...state, response]);
        setTodos((state) => [...state, response]);
      })
      .catch(() => {
        setError(ErrorMessages.addTodo);
      })
      .finally(() => setFocusTitleInput(true));

    setIsInputDisabled(false);
  };

  const removeTodo = (todoId: number) => {
    setTodosToDelete((current) => [...current, todoId]);

    const updatedList = () => {
      return filteredTodos.filter((todo) => todo.id !== todoId);
    };

    deleteTodo(todoId)
      .then(() => {
        setFilteredTodos(updatedList);
        setTodos(updatedList);
      })
      .catch(() => {
        setError(ErrorMessages.deleteTodo);
      })
      .finally(() => setTodosToDelete(
        todosToDelete.filter((id) => id !== todoId),
      ));
  };

  const updateTodo = async (todo: Todo, update: 'title' | 'complete') => {
    const data
      = update === 'title' ? todo : { ...todo, completed: !todo.completed };

    const updatedList = (res: Todo) => {
      return filteredTodos.map((t) => {
        if (res.id === t.id) {
          return res;
        }

        return t;
      });
    };

    await patchTodo(data)
      .then((res) => {
        setFilteredTodos(updatedList(res));
        setTodos(updatedList(res));
      })
      .catch(() => {
        setError(ErrorMessages.updateTodo);
      });
  };

  const clearCompleted = () => {
    filteredTodos.map(async (todo) => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  };

  const toggleAll = async () => {
    const isAllComplete = !filteredTodos?.every((t) => t.completed);
    const updatedList = () => {
      return filteredTodos.map((t) => ({ ...t, completed: isAllComplete }));
    };

    await filteredTodos.map(async (todo) => {
      if (todo.completed !== isAllComplete) {
        await patchTodo({ ...todo, completed: isAllComplete })
          .then(() => {
            setLoadingAll(false);
            setFilteredTodos(updatedList);
            setTodos(updatedList);
          })
          .catch(() => {
            setError(ErrorMessages.updateTodo);
          });
      }
    });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((result) => {
        setTodos(result);
        setFilteredTodos(result);
      })
      .catch(() => {
        setError(ErrorMessages.loadingTodos);
      });
  }, [todosToDelete]);

  useEffect(() => {
    setIncompleteTodos(todos?.filter((todo) => !todo.completed).length || 0);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoContent
        todos={filteredTodos}
        filterTodos={filterTodos}
        onError={(e: ErrorMessages | null) => setError(e)}
        createTodo={createTodo}
        tempTodo={tempTodo}
        isInputDisabled={isInputDisabled}
        deleteTodo={removeTodo}
        updateTodo={updateTodo}
        clearCompleted={clearCompleted}
        toggleAll={toggleAll}
        loadingAll={loadingAll}
        setLoadingAll={setLoadingAll}
        focusTitleInput={focusTitleInput}
        inCompleteTodos={inCompleteTodos}
      />

      {error && <Errors error={error} setError={setError} />}
    </div>
  );
};
