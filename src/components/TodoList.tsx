import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from './TodosContext';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';
import { FilterOption } from '../types/FilterOption';

export const TodoList: React.FC = () => {
  const { todos, filterOption, setErrorMessage } = useContext(TodosContext);

  const visibleTodos = todos.filter(todo => {
    switch (filterOption) {
      case FilterOption.Active:
        return !todo.completed;
      case FilterOption.Completed:
        return todo.completed;
      case FilterOption.All:
      default:
        return true;
    }
  });

  const deleteTodo = (id: number) => {
    return todoService.deleteTodo(id)
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  const updatedTodo = (newTodo: Todo) => {
    return todoService.updatedTodo(newTodo)
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      });
  };

  return (
    <ul className="todo-list" data-cy="todosList">
      {visibleTodos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          updateTodo={updatedTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
};
