import { useEffect, useState } from 'react';
import { useToDoContext } from '../../context/ToDo.context';
import { Filter } from './types';
import { useTodoRow } from '../ToDoList/useTodoRow';

export const useTodoFilter = () => {
  const { todos, filter, setTodoFilter } = useToDoContext();
  const [buttonIsDisabled, setButtonIsDisabled] = useState<boolean>(
    todos.completed.length === 0,
  );

  useEffect(() => setButtonIsDisabled(todos.completed.length === 0), [todos]);

  const { deleteTodo } = useTodoRow();

  return {
    onChangeFilter: (type:Filter) => setTodoFilter(type),
    active: todos.active.length,
    activeFilter: filter,
    clearCompleted: () => todos.completed.forEach(deleteTodo),
    buttonIsDisabled,
    showFooter: todos.all.length > 0,
  };
};
