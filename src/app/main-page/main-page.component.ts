import { Component, effect, OnInit, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { createFieldAction, createFormAction, loadData, saveFormData } from './store/action';
import { selectMainPageData, selectMainPageLoading } from './store/selectors';
import { FormField } from './store/interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestInputComponent } from '../fieldsComponent/test-input/test-input.component';
import { TestSelectComponent } from '../fieldsComponent/test-select/test-select.component';
import { TestCheckboxComponent } from '../fieldsComponent/test-checkbox/test-checkbox.component';
import { TestNumberComponent } from '../fieldsComponent/test-number/test-number.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    TestInputComponent,
    TestSelectComponent,
    TestCheckboxComponent,
    TestNumberComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})

export class MainPageComponent  {
  data: Signal<{ [formId: string]: any }>;
  loading: Signal<boolean>;
  fieldTypes: string[] = ['text', 'select', 'checkbox', 'number'];
  selectedFieldType: { [formId: string]: string } = {};
  formGroups: { [formId: string]: FormGroup } = {};
  isRequired: boolean = false;

  constructor(private store: Store, private fb: FormBuilder) {
    this.store.dispatch(loadData());

    this.data = toSignal(this.store.select(selectMainPageData), { initialValue: {} });
    this.loading = toSignal(this.store.select(selectMainPageLoading), { initialValue: false });

    effect(() => {
      const formData = this.data();
      if (formData) {
        this.createFormGroups(formData);
      }
    });
  }

  private createFormGroups(formData: { [formId: string]: any }) {
    for (const formId of Object.keys(formData)) {
      const formGroup = this.fb.group({});
      const fields = formData[formId]?.fields || [];

      fields.forEach((field: FormField) => {
        formGroup.addControl(field.id, new FormControl(field.value || '', this.getValidators(field)));
      });

      this.formGroups[formId] = formGroup;
    }
  }

  private getValidators(field: FormField) {
    const validators = [];
    if (field.required) {
      validators.push(Validators.required);
    }
    return validators;
  }

  submitForm(formId: string) {
    const form = this.formGroups[formId];

    if (form.invalid) {
      console.error('Form is invalid');
      return;
    }

    const formUUID = this.data()[formId].formId;
    const formValue = form.value;
    this.store.dispatch(saveFormData({formId: formUUID, data: formValue, formKey: formUUID}));
  }

  createNewForm() {
    const newFormId = uuidv4();
    const fieldId: string = uuidv4();
    this.store.dispatch(createFormAction({ formId: newFormId, fieldId: fieldId}));
  }

  createNewField(formKey: string) {
    const newFieldId = uuidv4();
    const fieldType = this.selectedFieldType[formKey] as "number" | "text" | "select" | "checkbox" || "text";
    const form = this.data()[0];
    const fields = form.fields;
    const formIdFromFirstField = fields[0].form_id;

    let newField: FormField;

    switch (fieldType) {
      case 'select':
        newField = {
          id: newFieldId,
          form_id: formIdFromFirstField,
          label: "Select field",
          type: "select",
          choices: ["Male", "Female"],
          required: this.isRequired,
          value: "Male"
        };
        break;

      case 'checkbox':
        newField = {
          id: newFieldId,
          form_id: formIdFromFirstField,
          label: "Agree to terms",
          type: "checkbox",
          required: this.isRequired,
          value: true
        };
        break;

      case 'number':
        newField = {
          id: newFieldId,
          form_id: formIdFromFirstField,
          label: "Number value",
          type: "number",
          value: 0,
          required: this.isRequired
        };
        break;

      default:
        newField = {
          id: newFieldId,
          form_id: formIdFromFirstField,
          label: "Text field",
          type: "text",
          value: '',
          required: this.isRequired
        };
    }

    this.store.dispatch(createFieldAction({ field: newField, formKey: formKey }));
  }


  getControl(formId: string, fieldId: string): FormControl | null {
    const control = this.formGroups[formId].get(fieldId);

    if (control instanceof FormControl) {
      return control;
    }

    return null;
  }

  onFieldTypeChange(formKey: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedFieldType[formKey] = selectElement.value;
  }

  protected readonly Object = Object;
  protected readonly FormControl = FormControl;
}
