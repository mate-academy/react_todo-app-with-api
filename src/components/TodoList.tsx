import { useContext, useMemo } from 'react';
import { TodoInfo } from './TodoInfo';
import { TodosContext } from '../context/TodoContext';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
  const {
    todos,
    selectedFilter,
    tempTodo,
    activeTodos,
    completedTodos,
  } = useContext(TodosContext);

  const visibleTodos = useMemo(() => {
    if (selectedFilter === 'completed') {
      return completedTodos;
    }

    if (selectedFilter === 'active') {
      return activeTodos;
    }

    return todos;
  }, [todos, selectedFilter]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => <TodoInfo todo={todo} key={todo.id} />)}
      {tempTodo && <TodoItem />}
    </section>
  );
};
