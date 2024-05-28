import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TUI_PASSWORD_TEXTS, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiDialogService, TuiHintModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { of } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';
import { BaseComponent } from '../../common/classes';

@Component({
  selector: 'rha-login',
  standalone: true,
  imports: [
    TuiInputPasswordModule,
    ReactiveFormsModule,
    TuiHintModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    HeaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    {
      provide: TUI_PASSWORD_TEXTS,
      useValue: of([ '' ]),
    },
  ]
})
export class LoginComponent extends BaseComponent {

  #fb = inject(FormBuilder);
  #router = inject(Router);
  #dialog = inject(TuiDialogService);

  loginForm = this.#fb.group({
    password: [ '', Validators.required ],
  });

  showForgotonPasswordDialog() {
    this.#dialog.open(
      '<p class="text-lg font-semibold">First restart your device and then log in using the default password "admin"</p>',
      { size: 's' }
    ).subscribe();
  }

  onLogin() {
    if ( this.loginForm.valid ) {
      this.linkZone.login(this.loginForm.value.password!)
        .subscribe((response) => {
          if ( response.result ) {
            this.#router.navigate([ '/admin', 'home' ]);
          }
        });
    }
  }

}
