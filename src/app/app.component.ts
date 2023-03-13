import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  name: any
  pass: any
  cPass: any
  title = 'myapp';
  verify(){
    console.log(this.name);
    console.log(this.pass);
    console.log(this.cPass);




    
    if(this.name=="Mandira" && this.pass=="pass@123"){
      console.log("logged in successfully");
    }
    else
    {console.log("invalid credentials");
    }
  }
}
