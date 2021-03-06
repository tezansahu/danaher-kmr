export interface User {
    success? : boolean;
    message? : string;
    errors? : any;
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    token?: string;
    loggedin?: boolean;
}
export interface SignUpForm {
    name: string;
    op_co: string;
    email_id: string;
    contact_no: string;
    passwd_hashed: string;
}
export interface LoginForm {
    username: string;
    password: string;
}