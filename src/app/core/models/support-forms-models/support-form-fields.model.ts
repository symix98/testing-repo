import { SupportForms } from "./support-form.model";

// support-form-fields.model.ts
export class SupportFormFields {
  id?: number;
  fieldName?: string;
  fieldType?: string;
  isRequired?: boolean;
  fieldOrder?: number;
  fieldOptions?: any;
  form?: SupportForms

}
