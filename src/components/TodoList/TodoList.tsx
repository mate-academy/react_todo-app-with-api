import React, { FormEvent, KeyboardEvent, RefObject } from 'react';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  editingId: number | null;
  editingTitle: string;
  processingIds: number[];
  editField: RefObject<HTMLInputElement>;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onStartEditing: (todo: Todo) => void;
  onEditingTitleChange: (title: string) => void;
  onEditSubmit: (event: FormEvent, todo: Todo) => void;
  onEditBlur: (todo: Todo) => void;
  onEditKeyUp: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  editingId,
  editingTitle,
  processingIds,
  editField,
  onToggleTodo,
  onDeleteTodo,
  onStartEditing,
  onEditingTitleChange,
  onEditSubmit,
  onEditBlur,
  onEditKeyUp,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isEditing={editingId === todo.id}
        isProcessing={processingIds.includes(todo.id)}
        editingTitle={editingTitle}
        editField={editField}
        onToggle={onToggleTodo}
        onDelete={onDeleteTodo}
        onStartEditing={onStartEditing}
        onEditingTitleChange={onEditingTitleChange}
        onEditSubmit={onEditSubmit}
        onEditBlur={onEditBlur}
        onEditKeyUp={onEditKeyUp}
      />
    ))}

    {tempTodo && <TempTodo todo={tempTodo} />}
  </section>
);
