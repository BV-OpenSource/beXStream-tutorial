import { Component, OnInit } from '@angular/core';
import { PaginatorDto } from 'src/app/lib/models/paginator.dto';
import { UserService } from '../../services/user.service';
import { FormBuilder } from '@angular/forms';
import { Role } from '../../models/role';
import { User } from '../../models/user';
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  roles: Role[] = [];
  paginator: PaginatorDto = new PaginatorDto();

  updateUserForm = this.formBuilder.group({
    username: '',
    description: '',
    password: ''
  });

  createUserForm = this.formBuilder.group({
    username: '',
    description: '',
    password: '',
    email: ''
  });


  editingUser: User = null;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private roleService: RoleService) { }

  ngOnInit(): void {
    this.paginator.limit = 0;
    this.listUsers();
    this.getAllRoles();
  }


  private listUsers() {
    this.userService
      .getAllUsers(this.paginator)
      .subscribe((users) => {

        this.users = users;
      });
  }

  private getAllRoles() {
    this.roleService
      .getAll()
      .subscribe((roles) => {
        this.roles = roles;
      });
  }

  editUser(user: User) {
    this.editingUser = user;

    this.updateUserForm.patchValue({
      username: user.username,
      description: user.description,
    });
  }

  updateUser() {
    const updateUserFormValues = this.updateUserForm.value;
    this.editingUser.username = updateUserFormValues.username;
    this.editingUser.description = updateUserFormValues.description;
    this.editingUser.password = updateUserFormValues.password;

    this.userService
      .update(this.editingUser)
      .subscribe((user) => {
        alert(`${user.username} has benn successfully updated!`);
        this.listUsers();
      });
  }

  deleteUser(user: User) {
    this.userService
      .delete(user)
      .subscribe(result => {
        alert(`${user.username} has benn successfully deleted!`);
      });
  }

  createUser() {
    const createUserFormValues = this.createUserForm.value;

    const newUser = new User();

    newUser.username = createUserFormValues.username;
    newUser.description = createUserFormValues.description;
    newUser.hash = createUserFormValues.password;
    newUser.email = createUserFormValues.email;
    newUser.roles = [this.roles[0]];


    this.userService
      .register(newUser)
      .subscribe((user) => {
        this.listUsers();
      });
  }
}
