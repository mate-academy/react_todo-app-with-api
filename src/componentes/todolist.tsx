import classNames from 'classnames';
import { TodoContext } from '../context/todocontext';
import React, { useContext, useState } from 'react';
import { TodoItem } from './todoItem';
import { completedTodo, deleteTodo, editTodo } from '../api/todos';

export const TodoList: React.FC = () => {
  // todos é uma prop que recebe todo, que é um array que recebera um objeto
  const context = useContext(TodoContext);

  const [editTitle, setEdiTitle] = useState<string>(''); //elber
  const [editingId, setEditingId] = useState<number | null>(null);

  if (!context) {
    return null;
  }

  const {
    handleRemove,
    visibleTodos,
    setTodo,
    todo,
    tempTodo,
    deletingIds,
    checkedIds,
    setCheckedIds,
    getError,
    inputRef,
  } = context;
  /* eslint-disable */
  const handleEdit = (id: number, newTitle: string) => {
    /* o filter pega todos os objetos que tem o id diferente do id do objeto que estou
        editando e retorna true para esses objetos montando um novo array com eles, enquanto os objetos com id igual retorna false
        e remove da matriz tex*/
    setCheckedIds(prev => [...prev, id]);
    if (newTitle.length === 0) {
      deleteTodo(id)
        .then(() => {
          setTodo(currentTodo => currentTodo.filter(t => t.id !== id));
          setEditingId(null);
        })
        .catch(() => getError('Unable to delete a todo'))
        .finally(() => {
          setCheckedIds(currentIds =>
            currentIds.filter(currentId => currentId !== id),
          );
          inputRef.current?.focus();
        });
    } else {
      editTodo(id, newTitle)
        .then(result => {
          const newArray = todo.map(t => {
            if (t.id === id) {
              return result;
            }
            return t;
          });
          setTodo(newArray);
          setEditingId(null);
        })
        .catch(() => getError('Unable to update a todo'))
        .finally(() => {
          setCheckedIds(currentIds =>
            currentIds.filter(currentId => currentId !== id),
          );
          if (editingId) {
            inputRef.current?.focus();
          }
        });
    }
  };

  /*   const handleSelected = (id: number, completed: boolean) => { [a, b, c, d]
    completedTodo(id, !completed)
      .then(() => {
        const newArray = todo.map(i => { o map executa o if para todos os elementos do array os que nao tem
        o id igual ao id da tarefa que cliquei sao copiados, e o que tem o id igual ao id da tarefa que cliquei
        tem todas as propriedades i copiadas e completed invertido, apos percorrer todos as tarefas do array
        o map me retorna um novo array com o elemento que tem o id igual ao id que cliquei com a propriedade completed
        invertida
        if (i.id === id) {
          return { ...i, completed: !completed };
        }

        return i;
        });
      setTodo(newArray);

    })


    };*/

  const handleSelected = (id: number, completed: boolean) => {
    setCheckedIds(prev => [...prev, id]);
    completedTodo(id, !completed)
      .then(updateTodosFromApi => {
        const newArray = todo.map(t => {
          if (t.id === updateTodosFromApi.id) {
            return updateTodosFromApi;
          }
          return t;
        });
        setTodo(newArray);
      })
      .catch(() => getError('Unable to update a todo'))
      .finally(() => {
        setCheckedIds(currentIds =>
          currentIds.filter(currentId => currentId !== id),
        );
      });
  };
  console.log('setCheckedIds', checkedIds);
  console.log('visibletodos', visibleTodos);
  /* eslint-enable */

  const handleId = (itemId: number) => {
    setEditingId(itemId);
  };

  const handleEventKey = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    title: string,
  ) => {
    if (event.key === 'Enter') {
      handleEdit(id, title);
    }
  };

  const handleEventCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <>
      {/* This is a completed todo */}
      {visibleTodos?.map(t => {
        const isBeingDeleted = deletingIds.includes(t.id);
        const isBeingChecked = checkedIds.includes(t.id);

        if (isBeingDeleted || isBeingChecked) {
          return (
            <TodoItem key={t.id} todo={t} isDeleting={true} isChecked={true} />
          );
        } else if (t.title.length !== 0) {
          return (
            <div
              key={t.id}
              data-cy="Todo"
              className={classNames('todo', {
                completed: t.completed,
              })}
            >
              <label className="todo__status-label" htmlFor={`todo-${t.id}`}>
                <input
                  id={`todo-${t.id}`}
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={t.completed}
                  aria-label="Marcar como concluido"
                  onChange={() => handleSelected(t.id, t.completed)} // em checkbox usamos onchang
                />
              </label>

              {editingId === t.id ? (
                <input
                  type="text"
                  data-cy="TodoTitleField"
                  value={editTitle}
                  autoFocus
                  onBlur={() => {
                    handleEdit(t.id, editTitle.trim());
                  }}
                  onKeyDown={event => {
                    handleEventKey(event, t.id, editTitle.trim());
                  }}
                  onKeyUp={event => handleEventCancel(event)}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setEdiTitle(event.target.value)
                  }
                />
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      handleId(t.id);
                      setEdiTitle(t.title);
                    }}
                  >
                    {t.title}
                  </span>
                  <button
                    onClick={() => handleRemove(t.id)}
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>
                </>
              )}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': false,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
              {/* Remove button appears only on hover */}
            </div>
          );
        }
      })}

      {tempTodo?.length !== 0 && tempTodo && <TodoItem todo={tempTodo} />}
    </>
  );
};
/* */
