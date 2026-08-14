import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-consultation-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  consultationForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?: [А-ЯЁ][а-яё]*)*$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/)]]
  });

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  isSuccess: boolean = false;
  @Input() isConsultation: boolean = false;
  errorMessage = '';

  get title(): string {
    return this.data.mode === 'service' ? 'Заявка на услугу' : 'Закажите бесплатную консультацию!';
  }

  get buttonText(): string {
    return this.data.mode === 'service' ? 'Оставить заявку' : 'Заказать консультацию';
  }

  submit(): void {
    if (this.consultationForm.invalid) {
      this.consultationForm.markAllAsTouched();
      return;
    }

    const { name, phone } = this.consultationForm.value;
    let request$;
    if (this.data.mode === 'service') {
      request$ = this.requestService.sendServiceRequest(name!, phone!, this.data.serviceType);
    } else {
      request$ = this.requestService.sendConsultationRequest(name!, phone!);
    }

    request$.subscribe({
      next: (response) => {
        if (response.error) {
          this.errorMessage = response.message || 'Ошибка при отправке формы. Попробуйте еще раз';
        } else {
          this.isSuccess = true;
        }
      },
      error: () => {
        this.errorMessage = 'Ошибка при отправке формы. Попробуйте еще раз';
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}