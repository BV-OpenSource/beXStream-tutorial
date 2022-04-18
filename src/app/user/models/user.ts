import { Organization } from "./organization";
import { Role } from "./role";

export class User {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  password: string;
  hash: string;
  description: string;
  createdDate: Date;
  token: string;
  roles: Role[];
  organization: Organization;

  constructor() {
    this.id = '';
    this.username = '';
    this.email = '';
    this.profileImage = '';
    this.password = '';
    this.hash = '';
    this.description = '';
    this.createdDate = new Date();
    this.token = '';
    this.roles = [];
    this.organization = new Organization();
  }
}
