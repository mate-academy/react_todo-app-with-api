import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../Store/TodoContext';
import { deleteTodos, updateTodos } from '../../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, setErrorMessage } = useContext(TodoContext);
  const { completed, title, id } = todo;
  const [handleDeleteTodoId, setHandleDeleteTodoId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState<string>(title);

  const titleEditInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleEditInput.current) {
      titleEditInput.current.focus();
    }
  }, [isEdit]);

  useEffect(() => {
    const todoInput = document.getElementById('todoInput');

    if (todo && todoInput) {
      todoInput.focus();
    }

    if (todo.id === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [handleDeleteTodoId, todo]);

  const handleDelete = (todoId: number) => {
    setHandleDeleteTodoId(todoId);
    setIsLoading(true);
    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(post => post.id !== todoId),
        );
      })
      .then(() => {
        setIsEdit(false);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        console.log('fail', isLoading);
        setErrorMessage('Unable to delete a todo');
      });
  };

  const updatedTitle = (post: Todo) => {
    const updatedTodo: Todo = {
      id: post.id,
      userId: 260,
      title: newTitle.trim(),
      completed: post.completed,
    };

    updateTodos(post.id, updatedTodo)
      .then(newTodo => {
        setTodos(currentTodos =>
          currentTodos.map(elemt =>
            elemt.id === newTodo.id ? newTodo : elemt,
          ),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .then(() => setIsEdit(false))
      .finally(() => {
        setIsLoading(false);
        // setIsEdit(false);
      });
  };

  // const updatedComplet = (id: number) => {
  //   const updatedTodo: Todo = {
  //     id: id,
  //     userId: 260,
  //     title: title.trim(),
  //     completed: !completed,
  //   };

  //   return updateTodos(id, updatedTodo)
  //     // .then((response) =>{
  //     //   return response.id
  //     // }
  //     // )
  //     .finally(() => setIsLoading(false));
  //   // return updateTodos(id, updatedTodo)
  //   //   .then(() => {
  //   //     setIsLoading(false);
  //   //     console.log('post', id);
  //   //   })
  //   //   .catch(() => setErrorMessage('Unable to update todo'));
  //   // setTodos(
  //   //   todos.map(elem =>{
  //   //     console.log(id, elem.id)
  //   //     return id === elem.id
  //   //       ? { ...elem, completed: !elem.completed }
  //   //       : elem
  //   //     }
  //   //   ),
  //   // ),
  // };

  // const handlerCompleted = () => {
  //   setIsLoading(true);
  //   updatedComplet(todo.id)
  //     .then((response) =>
  //     setTodos(
  //       todos.map(elem => {
  //         console.log('elem', elem.id === todo.id)
  //         return elem.id === todo.id ? { ...elem, completed: !elem.completed } : elem
  //       }
  //       ),
  //     ),
  //   );
  // };

  const updatedComplet = (post: Todo) => {
    const updatedTodo: Todo = {
      id: post.id,
      userId: 260,
      title: post.title.trim(),
      completed: !post.completed,
    };

    updateTodos(post.id, updatedTodo)
      .then(() => {
        // setTodos( //2
        //   todos.map(elem => {
        //     return elem.id === todo.id
        //       ? { ...elem, completed: !elem.completed }
        //       : elem;
        //   }),
        // );
        setTodos(currentTodos =>
          currentTodos.map(elemt =>
            elemt.id === todo.id
              ? { ...elemt, completed: !elemt.completed }
              : elemt,
          ),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const handlerCompleted = async () => {
    setIsLoading(true);
    updatedComplet(todo);

    // try {
    //   setIsLoading(true);
    //   await updatedComplet(todo);
    // } catch {
    //   console.log('error');
    // } finally {
    //   await setTodos(
    //     todos.map(elem => {
    //       console.log('elem', elem.id === todo.id);

    //       return elem.id === todo.id
    //         ? { ...elem, completed: !elem.completed }
    //         : elem;
    //     }),
    //   );
    // }

    // const updatedTodos = [...todos];
    // const currentTodoIndex = updatedTodos.findIndex(
    //   (elem: Todo) => elem.id === todo.id,
    // );

    // if (currentTodoIndex !== -1) {
    //   const newCompelte = !updatedTodos[currentTodoIndex].completed;

    //   updatedTodos[currentTodoIndex] = {
    //     ...updatedTodos[currentTodoIndex],
    //     completed: newCompelte,
    //   };
    //   updatedTodos.splice(currentTodoIndex, 1, updatedTodos[currentTodoIndex]);

    //   setTodos(updatedTodos);
    // }
  };

  const handleEdit = () => {
    if (newTitle.trim() === '') {
      setIsLoading(true);
      handleDelete(id);
    }

    if (title !== newTitle) {
      setIsLoading(true);
      updatedTitle(todo);
    }

    if (title === newTitle) {
      setIsEdit(false);
    }
  };

  const handleEditKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(title);
      setIsEdit(false);
    }

    if (e.key === 'Enter' && title === newTitle) {
      setIsEdit(false);
    }

    if (e.key === 'Enter') {
      handleEdit();
    }
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    /* This is a completed todo */
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      onDoubleClick={() => setIsEdit(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handlerCompleted}
          disabled={isLoading}
        />
      </label>

      {isEdit && (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyUp={handleEditKeyUp}
            onBlur={() => handleEdit()}
            ref={titleEditInput}
            disabled={isLoading}
          />
        </form>
      )}

      {!isEdit && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title.trim()}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      {/* 'is-active' class puts this modal on top of the todo */}
      {/* {isLoading || handleDeleteTodoId === todo.id ? <Loader /> : null} */}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          // 'is-active': selectedTodo.includes(id),
          'is-active': isLoading || handleDeleteTodoId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
