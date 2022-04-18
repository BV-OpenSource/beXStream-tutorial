import { Organization } from "./organization";

export class Role {
  id?: string;
  name: string;
  organization: Organization;
  constructor() {
    this.id = '';
    this.name = '';
    this.organization = new Organization();
  }
}
