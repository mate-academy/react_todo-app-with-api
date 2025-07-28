import { useContext } from 'react';
import { StateContext } from './StateContext';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { ToDoItem } from './ToDoItem';
import { TemporaryTodo } from './TemporaryTodo';

export const ToDoList = () => {
  const { todos, filter, tempTodo } = useContext(StateContext);

  const filteredTodos: () => Todo[] = () => {
    switch (filter) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const useFilteredTodos = filteredTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {useFilteredTodos.map(todo => (
        <ToDoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo !== null && <TemporaryTodo />}
    </section>
  );
};
