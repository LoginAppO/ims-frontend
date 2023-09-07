import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher, passwordValidator } from '../login/login.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
})
export class AddUserDialogComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  passwordFormControl = new FormControl('', [Validators.required, passwordValidator()]);

  matcher = new MyErrorStateMatcher();

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
  ) {}

  onSave(): void {
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      const emailValue = this.emailFormControl.value;
      const passwordValue = this.passwordFormControl.value;
      if (emailValue !== null && passwordValue !== null) {
        this.userService.add(emailValue, passwordValue).subscribe((response) => {
          if (response) {
            this.dialogRef.close(response);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
