import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email: string;
  password: string;
 
  signUp() {
    this.email = '';
    this.password = '';
  }

  signIn() {
    this.email = '';
    this.password = '';
  }

  signOut() {
  }


  constructor() {}
  ngOnInit(): void {
  }

}
