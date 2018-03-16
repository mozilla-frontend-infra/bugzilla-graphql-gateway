import Flag from './Flag';
import UserInformation from './UserInformation';
import { common, mappings } from './mappings';

export default class Bug {
  constructor(bug) {
    common.forEach(field => Object.assign(this, { [field]: bug[field] }));
    Object.entries(mappings).forEach(([key, value]) =>
      Object.assign(this, { [key]: bug[value] })
    );

    if (bug.cc_detail) {
      this.cc = bug.cc_detail.map(cc => new UserInformation(cc));
    }

    if (bug.flags) {
      this.flags = bug.flags.map(flag => new Flag(flag));
    }

    if (bug.creator_detail) {
      this.creator = new UserInformation(bug.creator_detail);
    }

    if (bug.qa_contact_detail) {
      this.qaContact = new UserInformation(bug.qa_contact_detail);
    }
  }
}
