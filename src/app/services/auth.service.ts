import { Role } from './../model/role.model';
import { User } from '../model/user.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /*users: User[] = [
    { username: 'admin', password: 'admin', roles: ['ADMIN'] },
    { username: 'user', password: 'user', roles: ['USER'] },
  ];*/

  public loggedUser: string;
  public isloggedIn: Boolean = false;
  public roles: Role[];
  apiURL: string = 'http://localhost:8081/users/login';

  constructor(private router: Router, private http: HttpClient) {}

  getUserFromDB(username: string): Observable<User> {
    const url = `${this.apiURL}/${username}`;
    return this.http.get<User>(url);
  }

  signIn(user: User) {
    this.loggedUser = user.username;
    this.isloggedIn = true;
    this.roles = user.roles;
    localStorage.setItem('loggedUser', this.loggedUser);
    localStorage.setItem('isloggedIn', String(this.isloggedIn));
  }
  isAdmin(): Boolean {
    let admin: Boolean = false;
    if (!this.roles)
      //this.roles== undefiened
      return false;
    this.roles.forEach((curRole) => {
      if (curRole.role == 'ADMIN') {
        admin = true;
      }
    });
    return admin;
  }
  getUserRoles(username: string) {
    this.getUserFromDB(username).subscribe((user: User) => {
      this.roles = user.roles;
    });
  }
  logout() {
    this.isloggedIn = false;
    this.loggedUser = undefined;
    this.roles = undefined;
    localStorage.removeItem('loggedUser');
    localStorage.setItem('isloggedIn', String(this.isloggedIn));
    this.router.navigate(['/login']);
  }

  setLoggedUserFromLocalStorage(login: string) {
    this.loggedUser = login;
    this.isloggedIn = true;
    this.getUserRoles(login);
  }
}
