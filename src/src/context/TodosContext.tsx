import React, { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { Statuses } from '../types/Statuses';
import { getTodos } from '../api/todos';
import { USER_ID } from '../constants/USER_ID';
import { Errors } from '../types/Errors';
import * as TodoService from '../api/todos';

type PropsTodosContext = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filter: Statuses;
  setFilter: (value: Statuses) => void;
  errorMessage: Errors,
  setErrorMessage: (value: Errors) => void,
  tempTodo: Todo | null,
  setTempTodo: (tempTodo: Todo | null) => void,
  title: string,
  setTitle: (title: string) => void,
  chosenTodoId: number[];
  setChosenTodoId: (id: number[]) => void;
  addTodo: (todo: Todo) => void,
  deleteTodo: (todoId: number) => void,
  deleteCompletedTodos: () => void;
  upgradeTodo: (todo: Todo) => void,
  handleToggleAll: () => void,
};

type Props = {
  children: React.ReactNode;
};

export const TodosContext = createContext<PropsTodosContext>({
  todos: [],
  setTodos: () => { },
  filter: Statuses.All,
  setFilter: () => {},
  errorMessage: Errors.NoErrors,
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  title: '',
  setTitle: () => {},
  chosenTodoId: [],
  setChosenTodoId: () => {},
  addTodo: () => {},
  deleteTodo: () => {},
  deleteCompletedTodos: () => {},
  upgradeTodo: () => {},
  handleToggleAll: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Statuses>(Statuses.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NoErrors);
  const [chosenTodoId, setChosenTodoId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(+USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LoadingError));
  }, []);

  const addTodo = (todo: Todo) => {
    setChosenTodoId([0]);
    setErrorMessage(Errors.NoErrors);

    setTempTodo({
      ...todo,
      id: 0,
    });

    return TodoService.createTodo(todo)
      .then(task => {
        setTodos([...todos, task]);
        setTitle('');
      })
      .catch((error) => {
        setErrorMessage(Errors.AddTodoError);
        setTitle(title);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setChosenTodoId([]);
      });
  };

  const deleteTodo = (taskId: number) => {
    setErrorMessage(Errors.NoErrors);
    setChosenTodoId([taskId]);
    const filteredTasks = todos.filter(task => task.id !== taskId);

    return TodoService.deleteTodo(taskId)
      .then(() => {
        setTodos(filteredTasks);
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(Errors.DeleteTodoError);
        throw error;
      })
      .finally(() => {
        setChosenTodoId([]);
      });
  };

  const deleteCompletedTodos = () => {
    const completedTaskIds = todos
      .filter(task => task.completed).map(task => task.id);

    setChosenTodoId(completedTaskIds);

    Promise.all(completedTaskIds.map(taskId => TodoService.deleteTodo(taskId)))
      .then(() => setTodos(prevTodos => prevTodos
        .filter(task => !task.completed)))
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(Errors.DeleteTodoError);
        throw error;
      })
      .finally(() => {
        setChosenTodoId([]);
      });
  };

  const upgradeTodo = (updatedTodo: Todo) => {
    setErrorMessage(Errors.NoErrors);
    setChosenTodoId([updatedTodo.id]);

    return TodoService.updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos => (
          currentTodos.map(todo => (
            todo.id !== updatedTodo.id
              ? todo
              : updatedTodo
          ))
        ));
      })
      .catch((error) => {
        setErrorMessage(Errors.UpdateTodoError);
        throw error;
      })
      .finally(() => {
        setChosenTodoId([]);
      });
  };

  const handleToggleAll = () => {
    const isEveryTodoCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => (isEveryTodoCompleted
      ? todo.completed
      : !todo.completed));

    const updatedTodoIds = todosToUpdate.map(todo => todo.id);

    setChosenTodoId(updatedTodoIds);

    const updatePromises = todosToUpdate.map(todo => TodoService.updateTodo({
      ...todo,
      completed: !isEveryTodoCompleted,
    }));

    Promise.all(updatePromises)
      .then(() => {
        setTodos(prevTodos => prevTodos.map(todo => ({
          ...todo,
          completed: !isEveryTodoCompleted,
        })));
      })
      .catch(error => {
        setErrorMessage(Errors.UpdateTodoError);
        throw error;
      })
      .finally(() => {
        setChosenTodoId([]);
      });
  };

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      filter,
      setFilter,
      errorMessage,
      setErrorMessage,
      tempTodo,
      setTempTodo,
      title,
      setTitle,
      chosenTodoId,
      setChosenTodoId,
      addTodo,
      deleteTodo,
      deleteCompletedTodos,
      upgradeTodo,
      handleToggleAll,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
