type Occupation = {
  nameofcompany: string;
  startdate: string;
  enddate: string;
  position: string;
};

export type UserDetails = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  gender: string;
  dateofbirth: string;
  placeofbirth: string;
  occupation: Occupation[]; // Array of Occupation objects
  nationality: string;
  phonenumber: string;
  mothersname: string;
  fathersname: string;
  maritalstatus: string;
  numberofchildren: number;
  primaryeducation: string;
  secondaryeducation: string;
  tertiaryeducation: string;
  hometown: string;
};

export interface DecodedToken {
  userid: number;
  fullname: string;
  email: string;
  phonenumber: string;
  dateofbirth: string;
  gender: string;
  nationality: string;
  accesslevel: any; // Adjust the type according to your needs
  iat: number;
  exp: number;
  image:string;
}

export interface InputItem {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
}