import { useContext } from 'react';
import { TodoContext } from './TodoContext';
import { TodoListItem } from './TodoListItem';
import { Todo } from '../types/Todo';
import { FilterSettings } from './TodoContext';

function filterList(list: Todo[], settings: FilterSettings): Todo[] {
  return list.filter(item => {
    switch (settings) {
      case FilterSettings.active:
        return !item.completed;
      case FilterSettings.completed:
        return item.completed;
      case FilterSettings.all:
        return item;
      default:
        return;
    }
  });
}

export const TodoList = () => {
  const { todosList, filterSettings, tempTodo } = useContext(TodoContext);
  const preparedList = filterList(todosList, filterSettings);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedList.map(todo => (
        <TodoListItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoListItem todo={tempTodo} key={0} />}
    </section>
  );
};
