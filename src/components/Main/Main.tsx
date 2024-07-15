import React, { useContext, useState } from 'react';
import { Errors } from '../../types/Errors';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { deleteTodo, getTodos, updateTodo } from '../../api/todos';
import { DispatchContext, StateContext } from '../../context/StateContext';

export const Main: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, loadingTodos, filter, tempTodo } = useContext(StateContext);

  const [initiated, setInitiated] = useState(false);

  if (!initiated) {
    const loadTodos = async () => {
      try {
        const todosFromServer = await getTodos().then(
          loadedTodos => loadedTodos,
        );

        setInitiated(true);
        dispatch({
          type: 'setTodos',
          payload: todosFromServer,
        });
      } catch (error) {
        dispatch({
          type: 'error',
          payload: Errors.todosLoad,
        });
      }
    };

    loadTodos();
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.active:
        return !todo.completed;
      case Filter.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleTodoDelete = async (todoId: number) => {
    if (loadingTodos.includes(todoId)) {
      return;
    }

    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      return;
    }

    dispatch({
      type: 'loadingTodos',
      payload: [...loadingTodos, todoId],
    });

    try {
      await deleteTodo(todoToDelete.id).then(response => response);

      dispatch({
        type: 'setTodos',
        payload: todos.filter(todo => todo.id !== todoToDelete.id),
      });
    } catch (error) {
      dispatch({
        type: 'error',
        payload: Errors.todoDelete,
      });
    } finally {
      dispatch({
        type: 'loadingTodos',
        payload: loadingTodos.filter(id => id !== todoId),
      });
    }
  };

  const handleTodoUpdate = async (todo: Todo) => {
    dispatch({
      type: 'loadingTodos',
      payload: [...loadingTodos, todo.id],
    });

    try {
      const updated = await updateTodo({ ...todo }).then(response => response);
      const updatedTodos = todos.map(item => {
        if (item.id === todo.id) {
          return { ...item, ...updated };
        }

        return item;
      });

      dispatch({
        type: 'setTodos',
        payload: updatedTodos,
      });
    } catch (error) {
      dispatch({
        type: 'error',
        payload: Errors.todoUpdate,
      });
    } finally {
      dispatch({
        type: 'loadingTodos',
        payload: loadingTodos.filter(id => id !== todo.id),
      });
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleTodoDelete}
          onUpdate={handleTodoUpdate}
          withLoader={loadingTodos.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={handleTodoDelete}
          onUpdate={handleTodoUpdate}
          withLoader={loadingTodos.includes(tempTodo.id)}
        />
      )}
    </section>
  );
};
