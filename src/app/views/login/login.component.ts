import { Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '@rha/components';
import { Router } from '@angular/router';
import { BaseComponent } from '@rha/common/classes';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'rha-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    LucideAngularModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent {

  #fb = inject(FormBuilder);
  #router = inject(Router);
  #dialog = inject(MatDialog);

  returnUrl = input<string>('');
  hide = signal(true);
  inputType = computed(() => this.hide() ? 'password' : 'text');
  suffixIcon = computed(() => this.hide() ? EyeOff : Eye);

  loginForm = this.#fb.group({
    password: this.#fb.nonNullable.control<string>('', Validators.required)
  });

  showForgotonPasswordDialog() {
    this.#dialog.open(ForgotonPasswordDialog);
  }

  clickEvent(event: MouseEvent) {
    event.stopPropagation();
    this.hide.set(!this.hide());
  }

  onLogin() {
    if ( this.loginForm.valid ) {
      this.linkZone.login(this.loginForm.value.password!)
        .subscribe((response) => {
          if ( response.result ) {
            this.returnUrl()
              ? this.#router.navigateByUrl(this.returnUrl())
              : this.#router.navigate([ '/admin', 'home' ]);
          }
        });
    }
  }

}

@Component({
  template: `
      <mat-dialog-content>
          <p class="text-lg font-medium">
              First restart your device and then log in using the default password “admin”
          </p>
      </mat-dialog-content>
      <mat-dialog-actions>
          <button mat-button mat-dialog-close>Close</button>
      </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule
  ]
})
export class ForgotonPasswordDialog {
}
