export interface FormField {
  id: string;
  form_id: string;
  label: string;
  value: any;
  type: 'text' | 'number' | 'select' | 'checkbox';
  required?: boolean;
  choices?: string[];
}

export interface Form {
  formId: string;
  fields: FormField[]
}

export interface FormsData {
  [key: string]: Form;
}
