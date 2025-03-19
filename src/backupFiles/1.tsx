// /* eslint-disable jsx-a11y/label-has-associated-control */
// /* eslint-disable jsx-a11y/control-has-associated-label */
// import React, { useEffect, useRef, useState } from 'react';
// import { UserWarning } from './UserWarning';
// import {
//   addTodo,
//   deleteTodo,
//   getTodos,
//   USER_ID,
//   updateTodo,
// } from './api/todos';
// import { Todo } from './types/Todo';
// import classNames from 'classnames';

// enum FilterName {
//   All = 'all',
//   Active = 'active',
//   Completed = 'completed',
// }

// enum KeyValue {
//   Enter = 'Enter',
//   Esc = 'Escape',
// }

// type OptionUpdate = 'all' | 'once';

// export const App: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string>('');
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [todo, setTodo] = useState<string>('');
//   const [isAllCompletedTots, setIsAllCompletedTots] = useState<boolean>(false);

//   const [waiterLoading, setWaiterLoading] = useState<number | null>(null);
//   const [tempTodo, setTempTodo] = useState<Todo | null>(null);

//   const [isFocus, setIsFocus] = useState(true);

//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const editTodoRef = useRef<HTMLInputElement | null>(null);

//   const [activeFilter, setActiveFilter] = useState<FilterName>(FilterName.All);

//   const [editedTodo, setEditedTodo] = useState<Todo | null>(null);

//   const showError = (text: string) => {
//     setErrorMsg(text);
//     const timerId = window.setTimeout(() => {
//       window.clearTimeout(timerId);
//       setErrorMsg('');
//     }, 3000);
//   };

//   const checkingIsAllCompletedTodos = (allTodos: Todo[]) => {
//     return allTodos.every(todoitem => todoitem.completed);
//   };

//   useEffect(() => {
//     setLoading(true);
//     getTodos()
//       .then((allTodos: Todo[]) => {
//         setTodos(allTodos);
//       })
//       .catch(() => showError('Unable to load todos'))
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     setIsAllCompletedTots(checkingIsAllCompletedTodos(todos));
//     {
//       isFocus && inputRef.current?.focus();
//     }
//   }, [todos, errorMsg]);

//   useEffect(() => {
//     {
//       editedTodo && editTodoRef.current?.focus();
//     }
//   }, [editedTodo]);

//   const onFilteredTodos = (filterName: FilterName): Todo[] => {
//     switch (filterName) {
//       case FilterName.All:
//         return todos;
//       case FilterName.Active:
//         return todos.filter(todoItem => !todoItem.completed);
//       case FilterName.Completed:
//         return todos.filter(todoItem => !!todoItem.completed);
//       default:
//         return todos;
//     }
//   };

//   function createNewTodo(title: string) {
//     return {
//       completed: false,
//       id: 0,
//       title: title,
//       userId: USER_ID,
//     };
//   }

//   const filteredTodos = onFilteredTodos(activeFilter);
//   const activeTodos = onFilteredTodos(FilterName.Active);
//   const completedTodos = onFilteredTodos(FilterName.Completed);

//   const handleCloseErrorButton = () => {
//     setErrorMsg('');
//   };

//   const createTodo = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!todo.trim()) {
//       showError('Title should not be empty');

//       return;
//     }

//     const newTempTodo = createNewTodo(todo.trim());

//     setTempTodo(newTempTodo);
//     setLoading(true);

//     addTodo(newTempTodo)
//       .then(newTodo => {
//         setTodos(prev => {
//           return [...prev, newTodo];
//         });
//         setTempTodo(null);
//         setTodo('');
//         setIsFocus(true);
//       })
//       .catch(() => {
//         showError('Unable to add a todo');
//         setTempTodo(null);
//         setIsFocus(true);
//       })
//       .finally(() => setLoading(false));
//   };

//   const removeTodo = (id: number) => {
//     setWaiterLoading(id);
//     deleteTodo(id)
//       .then(() => {
//         setTodos(prevTodos => {
//           return prevTodos.filter(todoItem => todoItem.id !== id);
//         });
//         setIsFocus(true);
//       })
//       .catch(() => showError('Unable to delete a todo'))
//       .finally(() => {
//         setWaiterLoading(null);
//         setIsFocus(true);
//       });
//   };

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setErrorMsg('');
//     setTodo(event.target.value);
//   };

//   const updateChecked = (
//     updatedTodo: Todo,
//     option: OptionUpdate = 'once',
//   ): void => {
//     let updateCompleted = !updatedTodo.completed;

//     if (option === 'all') {
//       updateCompleted = true;
//     }

//     setWaiterLoading(updatedTodo.id);
//     updateTodo({ ...updatedTodo, completed: updateCompleted })
//       .then(todoItem => {
//         setTodos(currentTodos => {
//           const newPosts = [...currentTodos];
//           const index = newPosts.findIndex(
//             todoIndex => todoIndex.id === updatedTodo.id,
//           );

//           newPosts.splice(index, 1, todoItem);

//           return newPosts;
//         });
//         // inputRef.current?.blur();
//       })
//       .catch(() => showError('Unable to update a todo'))
//       .finally(() => {
//         setWaiterLoading(null);
//         setIsFocus(false);
//       });
//   };

//   const toggleAllTodos = (): void => {
//     const isCompletedAllTodos = todos.some(item => !item.completed);

//     if (isCompletedAllTodos) {
//       const isNotActiveTodo = todos.filter(itemTodo => !itemTodo.completed);

//       isNotActiveTodo.map(todoItem => {
//         updateChecked(todoItem, 'all');
//       });

//       return;
//     }

//     todos.map(todoItem => {
//       updateChecked(todoItem, 'once');
//     });
//   };

//   const clearCompleted = (todosCompleted: Todo[]): void => {
//     todosCompleted.forEach(itemTodo => {
//       removeTodo(itemTodo.id);
//     });
//   };

//   const editOndDoubleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
//     editTodoRef.current?.focus();
//     setEditedTodo(prev =>
//       prev ? { ...prev, title: event.target.value } : null,
//     );
//   };

//   const updateTitle = (editTodo: Todo) => {
//     const isEdit = todos.some(oldTodo => {
//       return oldTodo.id === editTodo.id && oldTodo.title === editTodo.title;
//     });

//     console.log(isEdit);
//     if (isEdit) {
//       setEditedTodo(null);
//       setIsFocus(false);

//       return;
//     }

//     if (!editTodo.title.trim()) {
//       removeTodo(editTodo.id);
//       setIsFocus(true);

//       return;
//     }

//     setWaiterLoading(editTodo.id);

//     return updateTodo({ ...editTodo, title: editTodo.title.trim() })
//       .then(todoItem => {
//         setTodos(currentTodos => {
//           const newPosts = [...currentTodos];
//           const index = newPosts.findIndex(
//             todoIndex => todoIndex.id === editTodo.id,
//           );

//           newPosts.splice(index, 1, todoItem);

//           return newPosts;
//         });
//         setEditedTodo(null);
//         setIsFocus(false);
//       })
//       .catch(() => {
//         showError('Unable to update a todo');
//         setIsFocus(false);
//         editTodoRef.current?.focus();
//       })
//       .finally(() => {
//         setWaiterLoading(null);
//       });
//   };

//   const onKeyClick = (
//     event: React.KeyboardEvent<HTMLInputElement>,
//     editedTodoValue?: Todo,
//   ) => {
//     if (event.key === KeyValue.Enter && editedTodoValue) {
//       event.preventDefault();
//       updateTitle(editedTodoValue);

//       return;
//     }

//     if (event.key === KeyValue.Esc) {
//       setEditedTodo(null);
//     }
//   };

//   return (
//     <>
//       {!USER_ID ? (
//         <UserWarning />
//       ) : (
//         <div className="todoapp">
//           <h1 className="todoapp__title">todos</h1>

//           <div className="todoapp__content">
//             <header className="todoapp__header">
//               {todos.length > 0 && (
//                 <button
//                   type="button"
//                   className={classNames('todoapp__toggle-all', {
//                     active: isAllCompletedTots,
//                   })}
//                   data-cy="ToggleAllButton"
//                   onClick={toggleAllTodos}
//                 />
//               )}

//               <form onSubmit={createTodo} onReset={() => setTodo('')}>
//                 <input
//                   ref={inputRef}
//                   data-cy="NewTodoField"
//                   type="text"
//                   value={todo}
//                   className="todoapp__new-todo"
//                   placeholder="What needs to be done?"
//                   onChange={handleChange}
//                   disabled={loading}
//                 />
//               </form>
//             </header>

//             <section className="todoapp__main" data-cy="TodoList">
//               {filteredTodos?.map(todoItem => (
//                 <div
//                   data-cy="Todo"
//                   className={classNames('todo', {
//                     completed: todoItem.completed,
//                   })}
//                   key={todoItem.id}
//                 >
//                   <label className="todo__status-label">
//                     <input
//                       data-cy="TodoStatus"
//                       type="checkbox"
//                       className="todo__status"
//                       onChange={() => {
//                         updateChecked(todoItem);
//                       }}
//                       checked={todoItem.completed}
//                     />
//                   </label>

//                   {editedTodo?.id !== todoItem.id ? (
//                     <>
//                       <span
//                         data-cy="TodoTitle"
//                         className="todo__title"
//                         onDoubleClick={() => {
//                           setEditedTodo(todoItem);
//                           // setTimeout(() => editTodoRef.current?.focus(), 0);
//                         }}
//                       >
//                         {todoItem.title}
//                       </span>

//                       <button
//                         type="button"
//                         className="todo__remove"
//                         data-cy="TodoDelete"
//                         onClick={() => removeTodo(todoItem.id)}
//                       >
//                         ×
//                       </button>

//                       <div
//                         data-cy="TodoLoader"
//                         className={classNames('modal overlay', {
//                           'is-active': waiterLoading === todoItem.id,
//                         })}
//                       >
//                         <div
//                           className="modal-background
//                       has-background-white-ter"
//                         />
//                         <div className="loader" />
//                       </div>
//                     </>
//                   ) : (
//                     <React.Fragment key={todoItem.id}>
//                       {/* This todo is being edited */}

//                       {/* This form is shown instead of the title and remove button */}
//                       <form>
//                         <input
//                           ref={editTodoRef}
//                           data-cy="TodoTitleField"
//                           type="text"
//                           className="todo__title-field"
//                           placeholder="Empty todo will be deleted"
//                           checked={todoItem.completed}
//                           value={editedTodo.title}
//                           onBlur={event => {
//                             event.preventDefault();
//                             updateTitle(editedTodo);
//                           }}
//                           onKeyUp={event => onKeyClick(event)}
//                           onKeyDown={event => onKeyClick(event, editedTodo)}
//                           onChange={event => {
//                             editOndDoubleClick(event);
//                           }}
//                         />
//                       </form>

//                       <div
//                         data-cy="TodoLoader"
//                         className={classNames('modal overlay', {
//                           'is-active': waiterLoading === todoItem.id,
//                         })}
//                       >
//                         <div
//                           className="modal-background
//                         has-background-white-ter"
//                         />
//                         <div className="loader" />
//                       </div>
//                     </React.Fragment>
//                   )}
//                 </div>
//               ))}

//               {/* This todo is in loadind state */}
//               {tempTodo && (
//                 <div data-cy="Todo" className="todo">
//                   <label className="todo__status-label">
//                     <input
//                       data-cy="TodoStatus"
//                       type="checkbox"
//                       className="todo__status"
//                     />
//                   </label>

//                   <span data-cy="TodoTitle" className="todo__title">
//                     {tempTodo.title}
//                   </span>

//                   <button
//                     type="button"
//                     className="todo__remove"
//                     data-cy="TodoDelete"
//                   >
//                     ×
//                   </button>

//                   <div data-cy="TodoLoader" className="modal overlay is-active">
//                     <div
//                       className="modal-background
//                      has-background-white-ter"
//                     />
//                     <div className="loader" />
//                   </div>
//                 </div>
//               )}
//             </section>

//             {todos?.length > 0 && (
//               <footer className="todoapp__footer" data-cy="Footer">
//                 <span className="todo-count" data-cy="TodosCounter">
//                   {activeTodos.length} items left
//                 </span>

//                 <nav className="filter" data-cy="Filter">
//                   <a
//                     href="#/"
//                     className={classNames('filter__link', {
//                       selected: activeFilter === FilterName.All,
//                     })}
//                     data-cy="FilterLinkAll"
//                     onClick={() => setActiveFilter(FilterName.All)}
//                   >
//                     All
//                   </a>

//                   <a
//                     href="#/active"
//                     className={classNames('filter__link', {
//                       selected: activeFilter === FilterName.Active,
//                     })}
//                     data-cy="FilterLinkActive"
//                     onClick={() => setActiveFilter(FilterName.Active)}
//                   >
//                     Active
//                   </a>

//                   <a
//                     href="#/completed"
//                     className={classNames('filter__link', {
//                       selected: activeFilter === FilterName.Completed,
//                     })}
//                     data-cy="FilterLinkCompleted"
//                     onClick={() => setActiveFilter(FilterName.Completed)}
//                   >
//                     Completed
//                   </a>
//                 </nav>

//                 <button
//                   type="button"
//                   className="todoapp__clear-completed"
//                   data-cy="ClearCompletedButton"
//                   onClick={() => clearCompleted(completedTodos)}
//                   disabled={completedTodos.length < 1}
//                 >
//                   Clear completed
//                 </button>
//               </footer>
//             )}
//           </div>

//           <div
//             data-cy="ErrorNotification"
//             className={classNames(
//               'notification is-danger is-light has-text-weight-normal',
//               { hidden: !errorMsg },
//             )}
//           >
//             <button
//               data-cy="HideErrorButton"
//               type="button"
//               className="delete"
//               onClick={handleCloseErrorButton}
//             />
//             {errorMsg}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
