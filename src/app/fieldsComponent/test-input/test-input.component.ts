import { Component, Input, forwardRef } from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-test-input',
  templateUrl: './test-input.component.html',
  styleUrls: ['./test-input.component.css'],
  standalone: true,
  imports: [
    NgClass
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestInputComponent),
      multi: true
    }
  ]
})
export class TestInputComponent implements ControlValueAccessor {
  @Input() field: any;
  @Input() control!: FormControl | null;
  value: string = '';

  onChange: any = () => {};
  // onTouched: any = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  onTouched() {
    if (this.control) {
      this.control.markAsTouched();
    }
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
  }

  protected readonly indexedDB = indexedDB;
}
