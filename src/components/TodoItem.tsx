import React, { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onToggle: (todoId: number) => void;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, updates: Partial<Todo>) => Promise<void>;
  isLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  isLoading = false,
}) => {
  const [editTitle, setEditTitle] = useState(false);
  const [editingValue, setEditingValue] = useState('');

  // Iniciar a edição
  const onDoubleClickEditTitle = () => {
    setEditTitle(true);
    setEditingValue(todo.title);
  };

  const saveChanges = async (e: React.FormEvent | React.FocusEvent) => {
    e.preventDefault();

    const trimmedValue = editingValue.trim();

    // Se estiver vazio deleta o todo
    if (!trimmedValue) {
      onDelete(todo.id);

      return;
    }

    // Se o valor não mudou cancela a edição
    if (trimmedValue === todo.title) {
      setEditTitle(false);

      return;
    }

    // Atualiza o todo com o novo titulo.
    // Usa await para esperar a atualização concluida em handleUpdateTodo
    // Se tiver sucesso, fecha o formulário de edição
    try {
      await onUpdate(todo.id, { title: trimmedValue });
      setEditTitle(false);
    } catch {
      // Se onUpdate falhar, O formulário de edição permanecerá aberto
      // e o usuário pode tentar novamente.
      // em handleUpdateTodo já está mostrando a mensagem de erro, entao nao faz nada aqui.
    }
  };

  // Função para cancelar a edição (ESC)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditTitle(false);
      setEditingValue(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          aria-label={todo.title}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      {!editTitle ? (
        <>
          <span
            onDoubleClick={onDoubleClickEditTitle}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={saveChanges}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingValue}
            onChange={e => setEditingValue(e.target.value)}
            onBlur={saveChanges}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      )}

      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
