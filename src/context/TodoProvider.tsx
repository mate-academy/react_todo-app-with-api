import React, { useEffect, useMemo, useReducer } from 'react';
import { FilterStatus } from '../types/FilterStatus';
import { TitleType, Todo, UpdateDataProps } from '../types/Todo';
import { KeyEventsParams } from './type';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { TodosContext } from './TodosContext';
import { initialState, reducer } from '../state/todoReducer';
import { UserWarning } from '../UserWarning';

export const TodosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_ERROR', payload: '' });

    getTodos()
      .then(data => dispatch({ type: 'SET_TODOS', payload: data }))
      .catch(() =>
        dispatch({ type: 'SET_ERROR', payload: 'Unable to load todos' }),
      );
  }, []);

  const activeTodos = useMemo(
    () => state.todos.length > 0,
    [state.todos.length],
  );

  const filteredTodos = useMemo(() => {
    switch (state.filterTodosStatus) {
      case FilterStatus.ACTIVE:
        return state.todos.filter(todo => !todo.completed);
      case FilterStatus.COMPLETED:
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  }, [state.todos, state.filterTodosStatus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_TITLE', payload: event.target.value });
  };

  const addNewTodo = (newTask: Omit<Todo, 'id'>) => {
    const tempTask: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTask.title,
      completed: false,
    };

    dispatch({ type: 'TEMP_TODO', payload: tempTask });

    dispatch({ type: 'SET_LOADING', payload: true });

    addTodo(newTask)
      .then(data => {
        dispatch({ type: 'ADD_TODO', payload: data });
        dispatch({ type: 'TEMP_TODO', payload: null });
        dispatch({ type: 'SET_TITLE', payload: '' });
      })
      .catch(() => {
        dispatch({ type: 'SET_ERROR', payload: 'Unable to add a todo' });
        dispatch({ type: 'TEMP_TODO', payload: null });
      })
      .finally(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      });
  };

  const handleNewTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimTitle = state.title.trim();

    if (!trimTitle) {
      dispatch({ type: 'SET_ERROR', payload: 'Title should not be empty' });

      return;
    }

    const newTodoTask = {
      userId: USER_ID,
      title: trimTitle,
      completed: false,
    };

    addNewTodo(newTodoTask);
  };

  const removeTodo = (id: number) => {
    dispatch({ type: 'PROCESSING_TODO_ADD', payload: id });

    return deleteTodo(id)
      .then(() => dispatch({ type: 'REMOVE_TODO', payload: id }))
      .catch(() =>
        dispatch({ type: 'SET_ERROR', payload: 'Unable to delete a todo' }),
      )
      .finally(() => dispatch({ type: 'PROCESSING_TODO_REMOVE', payload: id }));
  };

  const updatedTodos = (data: UpdateDataProps) => {
    dispatch({ type: 'PROCESSING_TODO_ADD', payload: data.id });

    return updateTodo(data)
      .then(response =>
        dispatch({ type: 'UPDATE_TODO', payload: { response, id: data.id } }),
      )
      .catch(() =>
        dispatch({ type: 'SET_ERROR', payload: 'Unable to update a todo' }),
      )
      .finally(() =>
        dispatch({ type: 'PROCESSING_TODO_REMOVE', payload: data.id }),
      );
  };

  const handleRenameTitle = ({
    event,
    id,
    newTitle,
    setIsEditing,
  }: TitleType) => {
    event.preventDefault();
    const findTodo = state.todos.find(todo => todo.id === id);

    if (!findTodo) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (findTodo.title === trimmedTitle) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle == '') {
      removeTodo(findTodo.id);

      return;
    }

    const updatedTitle = {
      id: findTodo.id,
      title: trimmedTitle,
    };

    dispatch({ type: 'PROCESSING_TODO_ADD', payload: id });

    updateTodo(updatedTitle)
      .then(response => {
        dispatch({
          type: 'UPDATE_TODO',
          payload: { response, id: updatedTitle.id },
        });
        setIsEditing(false);
      })
      .catch(() =>
        dispatch({ type: 'SET_ERROR', payload: 'Unable to update a todo' }),
      )
      .finally(() =>
        dispatch({ type: 'PROCESSING_TODO_REMOVE', payload: updatedTitle.id }),
      );
  };

  const handleTitleKeyEvents: KeyEventsParams = (
    event,
    id,
    newTitle,
    setIsEditing,
  ) => {
    if (event.key === 'Enter') {
      handleRenameTitle({ event, id, newTitle, setIsEditing });
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const toggleCompleted = (todoItem?: Todo) => {
    if (todoItem) {
      const updateCompletedField = {
        id: todoItem.id,
        completed: !todoItem.completed,
      };

      updatedTodos(updateCompletedField);
    } else {
      const hasUncompleted = state.todos.some(todo => !todo.completed);

      const uncompletedTodo = state.todos.filter(
        todo => todo.completed === !hasUncompleted,
      );
      const updateCompletedFields = uncompletedTodo.map(todo => ({
        id: todo.id,
        completed: hasUncompleted,
      }));

      Promise.all(updateCompletedFields.map(todo => updatedTodos(todo)));
    }
  };

  const deleteAllCompletedTodos = () => {
    const completedTodos = state.todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    Promise.allSettled(completedTodos.map(todo => removeTodo(todo.id)));
  };

  return (
    <TodosContext.Provider
      value={{
        todos: state.todos,
        error: state.error,
        filteredTodos,
        handleTitle,
        toggleCompleted,
        activeTodos,
        deleteAllCompletedTodos,
        removeTodo,
        handleRenameTitle,
        processingTodoIds: state.processingTodoIds,
        handleNewTodo,
        title: state.title,
        isLoading: state.isLoading,
        tempTodo: state.tempTodo,
        filterTodosStatus: state.filterTodosStatus,
        handleTitleKeyEvents,
        dispatch,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
