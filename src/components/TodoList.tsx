import React, { useContext } from 'react';
import { TodoContext } from './TodoContex';
import { Filter } from '../types/Filter';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

const TodoList : React.FC = () => {
  const {
    todos,
    setErrorMessage,
    filter,
  } = useContext(TodoContext);

  const currentTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      case Filter.All:
      default:
        return true;
    }
  });

  const todoUpdate = async (newTodo: Todo) => {
    try {
      return await updateTodo(newTodo);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    }
  };

  const todoDelete = async (id: number) => {
    try {
      return await deleteTodo(id);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    }
  };

  return (
    <ul className="todo-list" data-cy="todosList">
      {currentTodos.map(todo => (
        <TodoItem
          todo={todo}
          deleteTodo={todoDelete}
          updateTodo={todoUpdate}
          key={todo.id}
        />
      ))}
    </ul>
  );
};

export default TodoList;
