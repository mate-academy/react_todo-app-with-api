import React, { useContext } from 'react';
import * as todoService from '../../api/todos';
import { DispatchContext, StateContext } from '../StateProvider';
import { Form } from '../Form';
import { Toggler } from '../Toggler';

export const TodoForm: React.FC = () => {
  const { todos, userId } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const allTodosCompleted = todos.every(todo => todo.completed);

  const addTodo = async (title: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });
    try {
      const newTodo = {
        userId,
        title,
        completed: false,
      };

      dispatch({ type: 'SET_TEMP_TODO', payload: { ...newTodo, id: 0 } });
      const todo = await todoService.createTodo(newTodo);

      dispatch({ type: 'SET_TEMP_TODO', payload: null });
      dispatch({ type: 'ADD_TODO', payload: todo });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Unable to add a todo' });
      dispatch({ type: 'SET_TEMP_TODO', payload: null });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const toggleAllTodos = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });

    try {
      todos
        .filter(todo => todo.completed === allTodosCompleted)
        .forEach(todo => {
          dispatch({ type: 'SET_SELECTED', payload: todo.id });
          dispatch({ type: 'TOGGLE_TODO', payload: todo.id });
        });

      if (allTodosCompleted) {
        await Promise.all(
          todos.map(todo => todoService.updateTodo({
            ...todo,
            completed: false,
          })),
        );
      } else {
        await Promise.all(
          todos.map(todo => todoService.updateTodo({
            ...todo,
            completed: true,
          })),
        );
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Unable to toggle all todos' });
      dispatch({ type: 'SET_TODOS', payload: todos });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'CLEAR_SELECTED' });
    }
  };

  return (
    <header className="todoapp__header">

      <Toggler
        hasAllTodosCompleted={allTodosCompleted}
        toggleAllTodos={toggleAllTodos}
      />

      <Form
        onSubmit={addTodo}
      />
    </header>
  );
};
