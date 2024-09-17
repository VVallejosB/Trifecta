import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageComponent } from "./components/error-message/error-message.component";
import { AuthService } from '@app/pages/users/services/auth.service';
import { Observable } from 'rxjs';

const actionType={
  signIn:{
    action: 'signIn',
    title: 'Inicia Sesión',
},
  signUp:{
  action:'signUp',
  title: 'Crea tu cuenta'
}} as const;

type ActionType = keyof typeof actionType;

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
  @Input() action!: ActionType;
  form!: FormGroup;
  title!: string;

  user$! :Observable<any>;

  private readonly authSvc = inject(AuthService);

  private readonly fb= inject(FormBuilder);
  private readonly emailPatter =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  ngOnInit(): void {
    this.title=
      this.action === actionType.signIn.action
      ?actionType.signIn.title
      :actionType.signUp.title

    this.initForm();

    this.user$ = this.authSvc.userState$;
}

onSubmit():void{
  const{email,password,nombre}= this.form.value;
  this.action === actionType.signIn.action ?
    this.authSvc.signIn(email, password) : this.authSvc.signUp(email, password);
}

hasError(field:string): boolean{
  const fieldName= this.form.get(field)
  return !!fieldName?.invalid && fieldName.touched;
}

signInGoogle():void {
  this.authSvc.signInGoogle();


}

private initForm(): void {
  this.form = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.emailPatter)]],
    password: ['', [Validators.required, Validators.minLength(5)]]

  })
}
}
