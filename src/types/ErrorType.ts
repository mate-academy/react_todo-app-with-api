export type ErrorType = 'add' | 'delete' | 'update' | 'none' | 'emptyTitle';
// ErrorType declaration to use error-consisting state in more straight-forward way
// add - means err during POST request to API
// delete - means err during DELETE request to API
// update - means err during PATCH request to API
// none - means no (any of handeled) error should be emmited
// emptyTitle - means err during POST|PATCH request to API with invalid title input-field value
