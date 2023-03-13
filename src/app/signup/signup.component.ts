import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from './user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor( private fb: FormBuilder) { }
  signUp!:FormGroup;
  ngOnInit(): void {
    this.signUp= this.fb.group(
      {
        name: ["mandira", [Validators.required, Validators.minLength(2), Validators.maxLength(10)  ]],
        pass:["",[Validators.required, Validators.pattern(/[A-z]/)]],
        cPass:["",[Validators.required, this.check ]]
      },

    )

  }
  check(value1: FormControl){
   let regex= /[a-z]/
   return regex.test(value1.value)?
   null: {errorMessage: {
    message: "Email is invalid"}
}
} 
  
// if(this.pass ==cPass)
// {

// }

submit(){

}

}
