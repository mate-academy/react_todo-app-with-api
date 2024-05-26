/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useReducer, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { useErrorNotifications } from '../store/Errors';
import {
  USER_ID,
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from '../api/todos';

type AddTodoAction = {
  type: 'ADD';
  payload: Todo;
};

type DeleteTodoAction = {
  type: 'DELETE';
  payload: number;
};

type UpdateTodoAction = {
  type: 'UPDATE';
  payload: Todo;
};

type InitTodoAction = {
  type: 'INIT';
  payload: Todo[];
};

type Action =
  | InitTodoAction
  | AddTodoAction
  | DeleteTodoAction
  | UpdateTodoAction;

const totosReduser = (todos: Todo[], action: Action) => {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'ADD':
      return [...todos, action.payload];
    case 'DELETE':
      return todos.filter(todo => todo.id !== action.payload);
    case 'UPDATE':
      return todos.map(todo => {
        const updated = action.payload;

        return todo.id === updated.id ? updated : todo;
      });
    default:
      return todos;
  }
};

export const useTodos = () => {
  const { setErrorMessage } = useErrorNotifications();
  const [todos, dispatch] = useReducer(totosReduser, []);
  const [title, setTitle] = useState('');
  const [tempState, setTempState] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();

    getTodos()
      .then(todosFromServer =>
        dispatch({ type: 'INIT', payload: todosFromServer }),
      )
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    const tempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempState(tempTodo);

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    postTodo(newTodo)
      .then((newTodoFromServer: Todo) => {
        dispatch({ type: 'ADD', payload: newTodoFromServer });
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }

        inputRef.current?.focus();

        setTempState(null);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingIds([id]);

    deleteTodo(id)
      .then(() => {
        dispatch({ type: 'DELETE', payload: id });
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setLoadingIds([]);
        inputRef.current?.focus();
      });
  };

  const handleUpdate = (todo: Todo) => {
    setLoadingIds([todo.id]);

    updateTodo(todo)
      .then(updatedTodo => dispatch({ type: 'UPDATE', payload: updatedTodo }))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setLoadingIds([]));
  };

  return {
    todos,
    title,
    setTitle,
    tempState,
    loadingIds,
    handleSubmit,
    handleDelete,
    handleUpdate,
    inputRef,
  };
};
