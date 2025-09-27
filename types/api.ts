export interface ApiResponse<T> {
  responseCode: number;
  responseMessage: string;
  data: T;
}

//................. Authentication Type Definition ..................//
export interface UserLoginPayloadProps {
  username: string;
  password: string;
  userType: "CUSTOMER" | "VENDOR" | "ADMIN"
}

export interface UserLoginData {
  token: string;
  email: string;
}

export interface CustomerPayload {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string
}

export interface CustomerData {
  custId: number,
  lastName: string,
  firstName: string,
  email: string,
  phoneNumber: string,
  active: boolean,
  emailValidated: boolean
}

export interface ResetPasswordQuery {
  email: string
}

export interface ResetPasswordFinalQuery {
  email: string,
  otp: string,
  newPassword: string
}

export type OTPPurpose =
  | "VENDOR_ONBOARDING"
  | "VENDOR_FORGOT_PASSWORD"
  | "CUSTOMER_ONBOARDING"
  | "CUSTOMER_FORGOT_PASSWORD";

export interface ValidateOTPPayload {
  recipient: string,
  purpose: OTPPurpose,
  channel: "EMAIL" | "SMS" | "BOTH",
  otp: string
}

export interface VendorPayload {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  username: string,
  businessType: string,
  businessProfileDTO: {
    id?: number,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    description: string
  }
}

export interface VendorData {
  id: number,
  lastName: string,
  firstName: string,
  email: string,
  phoneNumber: string,
  userType: "VENDOR" | "CUSTOMER",
  businessType: "HOTEL" |
    "INFLUENCER" |
    "RESTAURANT" |
    "CLUB" |
    "OTHERS" |
    "SUPERMARKET" |
    "PHARMACY" |
    "FASHION" |
    "TOUR_GUIDE" |
    "EXPERIENCES" |
    "EVENTS",
  businessProfile: {
    id: number,
    name: string,
    address: string,
    latitude: number | null,
    longitude: number | null,
    description: string
  },
  active: boolean,
  emailValidated: boolean,
  firstLogon: boolean,
  bizValidated: boolean
}

export interface OTPpayload {
  recipient: string,
  purpose: OTPPurpose,
  channel: "EMAIL" | "SMS" | "BOTH"
}

export interface ChangeVendorPasswordPayload {
  email: string,
  password: string,
  otp: string
}