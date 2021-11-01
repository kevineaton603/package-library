
export enum UserRoleEnum {
  Basic,
  Premium,
  Admin,
}
  
export type UserProfileModel = {
  username: string;
  url: string;
  roles: UserRoleEnum[];
};

export const PremiumProfile = Object.freeze({
  username: 'keaton@champlain.edu',
  url: 'https://github.com/kevineaton603',
  roles: [UserRoleEnum.Premium],
});

export const BasicProfile = Object.freeze({
  username: 'gov.eaton@gmail.com',
  url: 'https://github.com/kevineaton603',
  roles: [UserRoleEnum.Basic],
});

export const AdminProfile = Object.freeze({
  username: 'kevin.saco.eaton@gmail.com',
  url: 'https://github.com/kevineaton603',
  roles: [UserRoleEnum.Admin],
});

export const Profiles = [
  PremiumProfile,
  BasicProfile,
  AdminProfile,
];
