export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  university: string;
  course_subject: string;
  created_at: string;
  updated_at: string;
}

export interface University {
  name: string;
  country: string;
  domains: string[];
  web_pages: string[];
  alpha_two_code: string;
  state_province?: string;
}

export interface FirstTimeUserFormData {
  firstName: string;
  lastName: string;
  university: string;
  courseSubject: string;
}
