import React from 'react';
import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  filterType: FilterType;
  selectedTodoId: number | null;
  setErrorMessage: (message: string) => void;
  onSelectTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (todoId: number, data: Partial<Todo>) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  filterType,
  selectedTodoId,
  setErrorMessage,
  onDeleteTodo,
  onUpdateTodo,
  tempTodo,
}) => {
  const getFilteredTodos = () => {
    switch (filterType) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'all':
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loadingTodoIds.includes(todo.id)}
          isSelected={selectedTodoId === todo.id}
          onUpdate={(title?: string) =>
            title
              ? onUpdateTodo(todo.id, { title })
              : onUpdateTodo(todo.id, { completed: !todo.completed })
          }
          onDelete={() => onDeleteTodo(todo.id)}
          setErrorMessage={setErrorMessage}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loading={true}
          isSelected={false}
          onUpdate={() => {}}
          onDelete={() => {}}
          setErrorMessage={() => {}}
        />
      )}
    </section>
  );
};
