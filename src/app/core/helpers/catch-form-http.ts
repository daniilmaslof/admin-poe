import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { EMPTY, Subject, OperatorFunction } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const SERVER_HTTP_ERROR = 'Oops, something went wrong';

/**
 * HttpError.
 */
interface HttpError {
  /**
   * Field name.
   */
  field: string;

  /**
   * Error messages.
   */
  messages: string[];
}

/**
 * Base message class.
 */
export class Message {

  /**
   * Text.
   */
  public text: string;

  /**
   * Status.
   */
  public status: any;

  constructor(data: Partial<Message>) {
    this.text = data.text;
    this.status = data.status;
  }

}

/**
 * Error message.
 */
export class ErrorMessage extends Message {

  constructor(message: string) {
    super({
      text: message,
    });
  }

}

/**
 * Error code status with server-side validation error.
 */
const UNPROCESSABLE_ENTITY = 422;

/**
 * Catches http error and sets error message for form in `httpError` field and add server validations errors to all fields.
 * @param form to which errors are added.
 * @param mapperFieldsObject The object that converts the dto name field to the name field in form.
 */
export function catchFormHttpError<T, R>(
  form: AbstractControl,
  mapperFieldsObject?: { [key: string]: string },
): OperatorFunction<T, never> {
  return catchError((e: HttpErrorResponse) => {
    setErrorToForm(form, e);
    setErrorsToFormFields(form, e);
    return EMPTY;
  }) as OperatorFunction<T, never>;
}

/**
 * Catches http error and emits error message.
 * @param message$ Error message stream.
 * @param callback A callback to be called after emitting an error.
 */
export function catchHttpErrorMessage<T, R>(
  message$: Subject<ErrorMessage | null>,
  // tslint:disable-next-line:ban-types
  callback?: Function,
): OperatorFunction<T, T | never> {
  return catchError((e: HttpErrorResponse) => {
    const error = new ErrorMessage(getHttpError(e));
    message$.next(error);
    if (callback) {
      callback();
    }
    return EMPTY;
  });
}

function getHttpError(e: HttpErrorResponse): string {
  if (!environment.production) {
    return getDevelopmentError(e);
  }
  if (!(e instanceof HttpErrorResponse)) {
    throw Error('Argument must be HttpErrorResponse');
  }
  const clientError = e.status >= 400 && e.status < 500;
  return clientError && e.error
    ? Array.isArray(e.error.errors) && e.error.errors.length > 0
      ? getFirstError(e.error.errors)
      : e.error.message
    : SERVER_HTTP_ERROR;
}

/**
 * Display error in development and display it in console.
 */
function getDevelopmentError(e: HttpErrorResponse): string {
  if (e.error && Array.isArray(e.error.errors) && e.error.errors.length > 0) {
    return getFirstError(e.error.errors);
  }
  if (e.error && e.error.message) {
    return e.error.message;
  }
  return e.message;

}

function setErrorToForm(form: AbstractControl, e: HttpErrorResponse): void {
  if (e.status !== UNPROCESSABLE_ENTITY) {
    form.setErrors({
      httpError: getHttpError(e),
    });
  }
}

/**
 * Set server error to form fields.
 * @param form which fields get error from server.
 * @param err from server.
 * @param mapperFieldsObject The object that converts the dto name field to the name field in form.
 */
function setErrorsToFormFields(form: AbstractControl, err: HttpErrorResponse, mapperFieldsObject?: { [key: string]: string }): void {
  if (err.status === UNPROCESSABLE_ENTITY) {
    const validationErrors = err.error.errors;
    Object.keys(validationErrors).forEach(prop => {
      const nameFieldControl = mapperFieldsObject ? mapperFieldsObject[prop] : prop;
      const formControl = form.get(nameFieldControl);
      if (formControl) {
        formControl.setErrors({
          serverErrors: validationErrors[prop],
        });
      } else {
        form.setErrors({
          serverErrors: validationErrors[prop],
        });
      }
    });
  }
}

function getFirstError(errors: HttpError[]): string {
  const e = errors.find(error => error.messages.length > 0);
  if (e) {
    return e.messages[0];
  }
  return SERVER_HTTP_ERROR;
}
