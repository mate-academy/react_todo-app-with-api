import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoDeleteButton } from './TodoDeleteButton';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onDelete: () => void;
  onToggle: () => void;
  onUpdate: (todo: Todo) => Promise<void>; // Nova prop para salvar a edição
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  // Foca o input automaticamente ao entrar no modo de edição
  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = async () => {
    const trimmedTitle = newTitle.trim();

    // 1. Se o título não mudou, apenas fecha o modo de edição
    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    // 2. Se o título ficou vazio, deletamos o todo
    if (!trimmedTitle) {
      onDelete();

      return;
    }

    // 3. Tenta atualizar na API
    try {
      await onUpdate({ ...todo, title: trimmedTitle });
      setIsEditing(false);
    } catch (error) {
      // Se der erro, mantém o input aberto para correção
      editFieldRef.current?.focus();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }

    if (event.key === 'Escape') {
      setNewTitle(todo.title); // Reseta para o valor original
      setIsEditing(false);
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing, // Adiciona classe de edição se necessário
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          checked={todo.completed}
          className="todo__status"
          data-cy="TodoStatus"
          type="checkbox"
          onChange={onToggle}
          aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
          style={{ flexGrow: 1 }} // Garante que o input ocupe o espaço do texto
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            ref={editFieldRef}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          data-cy="TodoTitle"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {/* Botão de delete só aparece se não estiver editando */}
      {!isEditing && (
        <TodoDeleteButton onDelete={onDelete} isLoading={isLoading} />
      )}

      <div
        className={classNames('modal', { 'is-active': isLoading })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
