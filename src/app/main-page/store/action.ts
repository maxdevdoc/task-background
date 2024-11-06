import { createAction, props } from '@ngrx/store';

export const loadData = createAction('[MainPage] Load Data');

export const loadDataSuccess = createAction(
  '[MainPage] Load Data Success',
  props<{ data: any }>()
);

export const loadDataFailure = createAction(
  '[MainPage] Load Data Failure',
  props<{ error: any }>()
);

//////////////////////////SAVE FORM//////////////////////////////////////////////
export const saveFormData = createAction(
  '[Form] Save Form Data',
  props<{ formId: string; data: any; formKey: string }>()
);

export const saveFormDataSuccess = createAction(
  '[Form] Save Form Data Success',
  props<{ data: any }>()
);

export const saveFormDataError = createAction(
  '[Form] Save Form Data Error',
);
//////////////////////////CREATE FORM//////////////////////////////////////////////
export const createFormAction = createAction(
  '[Form] Create New Form',
  props<{ formId: string, fieldId: string }>()
);

export const createFormActionSuccess = createAction(
  '[Form] Create New Form Success',
  props<{ data: any }>()
);

export const createFormActionError = createAction(
  '[Form] Create New Form'
);
export const createFieldAction = createAction(
  '[Form] Create New Field',
  props<{ field: any, formKey: string }>()
);

export const createFieldActionSuccess = createAction(
  '[Form] Create New Field Success',
  props<{ data: any, formKey: string }>()
);

export const createFieldActionError = createAction(
  '[Form] Create New Field Error'
);


export const saveFormSuccess = createAction('[MainPage] Save Form Success');
export const saveFormFailure = createAction('[MainPage] Save Form Failure', props<{ error: any }>());
