/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { EditingItem } from '../../types/EditingItem';
import { verifyTitle } from '../../utils/verifyTitle';

type Props = {
  visibleTodos: Todo[];
  updateTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  isSaving: boolean;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  updateTodo,
  deleteTodo,
  tempTodo,
  isSaving,
  deletingTodoIds,
  updatingTodoIds,
}) => {
  const [editingItem, setEditingItem] = useState<EditingItem>({
    selectedTodo: null,
    editedTitle: '',
  });

  const startEditing = (todo: Todo) => {
    setEditingItem({ selectedTodo: todo, editedTitle: todo.title });
  };

  const stopEditing = () => {
    setEditingItem({ selectedTodo: null, editedTitle: '' });
  };

  const updateEditingTitle = (editedTitle: string) => {
    setEditingItem(prev => ({ ...prev, editedTitle }));
  };

  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const { editedTitle, selectedTodo } = editingItem;

    if (selectedTodo) {
      const isValidTitle = verifyTitle(editedTitle);

      if (!isValidTitle) {
        deleteTodo(selectedTodo.id);

        return;
      }

      if (editedTitle === selectedTodo.title) {
        stopEditing();

        return;
      }

      updateTodo({ ...selectedTodo, title: editedTitle.trim() }).then(() =>
        stopEditing(),
      );
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && editingItem.selectedTodo) {
      stopEditing();
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos?.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onStatusChange={updateTodo}
              onUpdateSubmit={handleUpdateSubmit}
              editingItem={editingItem}
              startEditing={startEditing}
              updateEditingTitle={updateEditingTitle}
              onKeyUp={handleKeyUp}
              deleteTodo={deleteTodo}
              deletingTodoIds={deletingTodoIds}
              updatingTodoIds={updatingTodoIds}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
            <TodoItem
              todo={tempTodo}
              onStatusChange={updateTodo}
              onUpdateSubmit={handleUpdateSubmit}
              editingItem={editingItem}
              startEditing={startEditing}
              updateEditingTitle={updateEditingTitle}
              onKeyUp={handleKeyUp}
              deleteTodo={deleteTodo}
              deletingTodoIds={deletingTodoIds}
              updatingTodoIds={updatingTodoIds}
              isSaving={isSaving}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
