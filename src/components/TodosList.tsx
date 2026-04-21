/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

import { Todo as TypeTodo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: TypeTodo[];
  onDelete: (todoid: number) => Promise<void>;
  tempTodo: TypeTodo | null;
  isProssesingId: number[];
  handleToggleCompleleTodo: (todo: Pick<TypeTodo, 'id' | 'completed'>) => void;
  editTitleInput: string;
  setEditTitleInput: (str: string) => void;
  editTodo: TypeTodo | null;
  setEditTodo: (todo: TypeTodo | null) => void;
  onEditSubmit: (todo: TypeTodo) => void;
};

const TodosListComponent: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  isProssesingId,
  handleToggleCompleleTodo,
  editTitleInput,
  setEditTitleInput,
  editTodo,
  setEditTodo,
  onEditSubmit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isProssesing = isProssesingId.includes(todo.id);

        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDelete={onDelete}
            handleToggleCompleleTodo={handleToggleCompleleTodo}
            isProssesing={isProssesing}
            titleInput={editTitleInput}
            setTitleInput={setEditTitleInput}
            editTodo={editTodo}
            setEditTodo={setEditTodo}
            onEditSubmit={onEditSubmit}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isProssesing={true}
          onDelete={onDelete}
          handleToggleCompleleTodo={handleToggleCompleleTodo}
          titleInput={editTitleInput}
          setTitleInput={setEditTitleInput}
          editTodo={editTodo}
          setEditTodo={setEditTodo}
          onEditSubmit={onEditSubmit}
        />
      )}
    </section>
  );
};

export const TodosList = React.memo(TodosListComponent);
