export default class UserInformation {
  constructor(user) {
    this.id = user.id;
    this.name = user.real_name;
    this.username = user.name;
  }
}
