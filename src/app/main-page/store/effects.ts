import { Injectable, Signal } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';
import { of } from 'rxjs';
import { MainPageService } from '../../service/dataFakeApiService';
import {
  createFieldAction,
  createFieldActionError,
  createFieldActionSuccess,
  createFormAction,
  createFormActionError,
  loadData,
  loadDataFailure,
  loadDataSuccess,
  saveFormData,
  saveFormDataError,
  saveFormDataSuccess,
} from './action';
import { Store } from '@ngrx/store';
import { selectMainPageData } from './selectors';
import { AppState } from '../../store+/app.state';
import { toSignal } from '@angular/core/rxjs-interop';
import Notiflix from 'notiflix';

@Injectable()
export class MainPageEffects {
  loadData$;
  saveFormData$;
  createFormEffect$;
  createFieldEffect$;
  saveFormDataSuccess$;
  data: Signal<{ [formId: string]: any }>;

  constructor(
    private actions$: Actions,
    private mainPageService: MainPageService,
    private store: Store<AppState>
  ) {
    this.data = toSignal(this.store.select(selectMainPageData), { initialValue: {} });
    this.loadData$ = createEffect(() =>
      this.actions$.pipe(
        ofType(loadData),
        mergeMap(() =>
          this.mainPageService.getFormData().pipe(
            map(response => {
              const forms = Object.entries(response).map(([formId, fields]) => ({
                formId,
                fields: fields as any[]
              }));

              return loadDataSuccess({ data: forms });
            }),
            catchError((error) => {
              return of(loadDataFailure({ error }));
            })
          )
        )
      )
    );

    this.saveFormDataSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(saveFormDataSuccess),
          tap(() => {
            Notiflix.Notify.success('Данные успешно сохранены', {
              timeout: 3000,
              position: 'right-bottom',
            });
          })
        ),
      { dispatch: false }
    );

    this.saveFormData$ = createEffect(() =>
      this.actions$.pipe(
        ofType(saveFormData),
        mergeMap(action => {
          const formObject = Object.values(this.data()).find(
            (entry: any) => entry.formId === action.formKey
          );

          if (formObject) {
            const updatedFields = formObject.fields.map((field: any) => ({
              ...field,
              value: action.data[field.id] !== undefined ? action.data[field.id] : field.value
            }));

            const updatedForm = {
              ...formObject,
              fields: updatedFields,
            };

            return this.mainPageService.saveForm(updatedForm).pipe(
              map(() => saveFormDataSuccess({ data: updatedForm })),
              catchError(() => of(saveFormDataError()))
            );
          } else {
            return of(saveFormDataError());
          }
        })
      )
    );

    this.createFormEffect$ = createEffect(() =>
      this.actions$.pipe(
        ofType(createFormAction),
        mergeMap(action => {
          const field = {
            id: action.fieldId,
            form_id: action.formId,
            label: 'Text field',
            value: '',
            type: 'text',
            required: true
          };

          return this.mainPageService.createField(field).pipe(
            map(() => loadData()),
            catchError(error => of(createFormActionError()))
          );
        })
      )
    );
    this.createFieldEffect$ = createEffect(() =>
      this.actions$.pipe(
        ofType(createFieldAction),
        mergeMap(action => {
          const field = action.field

          return this.mainPageService.createField(field).pipe(
            map(() => createFieldActionSuccess({ data: field, formKey: action.formKey })),
            catchError(error => of(createFieldActionError()))
          );
        })
      )
    );
  }
}
