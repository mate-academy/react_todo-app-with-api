import React from 'react';
import { Todo } from '../types/Todo';
import { OptionUpdate } from '../types/OptionsType';
import { TodoItem } from './TodoItem';
import { TempTodoItem } from './TempTodoItem';

type Props = {
  todos: Todo[] | [];
  tempTodo: Todo | null;
  filteredTodos: Todo[] | null;
  removeTodo: (id: number) => Promise<string>;
  updateChecked: (updatedTodo: Todo, option: OptionUpdate) => void;
  showError: (text: string) => void;
  updateTitle: (todo: Todo) => Promise<string>;
  waiterLoading: number | null;
};

export const TodoList: React.FC<Props> = ({
  tempTodo,
  filteredTodos,
  removeTodo,
  updateChecked = () => {},
  updateTitle,
  waiterLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todoItem => (
        <TodoItem
          key={todoItem.id}
          todoItem={todoItem}
          updateChecked={updateChecked}
          removeTodo={removeTodo}
          waiterLoading={waiterLoading}
          updateTitle={updateTitle}
        />
      ))}

      {tempTodo && <TempTodoItem key={tempTodo.id} tempTodo={tempTodo} />}
    </section>
  );
};
