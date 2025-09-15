import {
    ApiResponse,
    CustomerPayload,
    CustomerData,
    ResetPasswordQuery,
    UserLoginData,
    UserLoginPayloadProps,
    ValidateOTPPayload,
    VendorPayload,
    VendorData,
    OTPpayload,
    ChangeVendorPasswordPayload,
    ResetPasswordFinalQuery,
} from "@/types/api";

// API request helper function
const apiRequest = async <T>(endpoint: string, payload: any, logName: string): Promise<ApiResponse<T>> => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    try {
        console.log(`[${requestId}] 🚀 FRONTEND ${logName} REQUEST:`, {
            timestamp: new Date().toISOString(),
            method: 'POST',
            endpoint,
            payload: logName.includes('LOGIN') && payload.password
                ? { ...payload, password: '[REDACTED]' }
                : logName.includes('REGISTER') && payload.password
                ? { ...payload, password: '[REDACTED]' }
                : payload
        });

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        const duration = Date.now() - startTime;

        console.log(`[${requestId}] ${response.ok ? '✅' : '❌'} FRONTEND ${logName} RESPONSE:`, {
            timestamp: new Date().toISOString(),
            status: response.status,
            duration: `${duration}ms`,
            data: logName.includes('LOGIN') && data.data?.token
                ? { ...data, data: { ...data.data, token: '[TOKEN_RECEIVED]' } }
                : data
        });

        return data;
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[${requestId}] 💥 FRONTEND ${logName} ERROR:`, {
            timestamp: new Date().toISOString(),
            endpoint,
            duration: `${duration}ms`,
            error: error instanceof Error ? error.message : 'Unknown error'
        });

        return {
            responseCode: 500,
            responseMessage: 'Network error occurred',
            data: null as T,
        };
    }
};

export const userLogin = async (payload: UserLoginPayloadProps): Promise<ApiResponse<UserLoginData>> => {
    return apiRequest<UserLoginData>('/api/auth/login', payload, 'LOGIN');
};

export const registerCustomer = async (payload: CustomerPayload): Promise<ApiResponse<CustomerData>> => {
    return apiRequest<CustomerData>('/api/customer/register', payload, 'CUSTOMER_REGISTER');
};

export const registerVendor = async (payload: VendorPayload): Promise<ApiResponse<VendorData>> => {
    return apiRequest<VendorData>('/api/vendor/register', payload, 'VENDOR_REGISTER');
};

export const generateOTP = async (payload: OTPpayload): Promise<ApiResponse<String>> => {
    return apiRequest<String>('/api/otp/generate', payload, 'OTP_GENERATE');
};

export const verifyOTP = async (payload: ValidateOTPPayload): Promise<ApiResponse<String>> => {
    return apiRequest<String>('/api/otp/verify', payload, 'OTP_VERIFY');
};

// Legacy functions - keeping for backward compatibility but using direct backend calls
// You may want to create API routes for these as well if needed

export const resetPassword = async (query: ResetPasswordQuery): Promise<ApiResponse<null>> => {
    try {
        const response = await fetch('/api/customer/reset-password?' + new URLSearchParams(query as any), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Reset password failed:', error);
        return {
            responseCode: 500,
            responseMessage: 'Network error occurred',
            data: null,
        };
    }
};

export const resetPasswordFinal = async (query: ResetPasswordFinalQuery): Promise<ApiResponse<String>> => {
    try {
        const response = await fetch('/api/customer/reset-password-final?' + new URLSearchParams(query as any), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Reset password final failed:', error);
        return {
            responseCode: 500,
            responseMessage: 'Network error occurred',
            data: null as String,
        };
    }
};

export const validateVendorRegistration = async (payload: ValidateOTPPayload): Promise<ApiResponse<String>> => {
    try {
        const response = await fetch('http://45.33.68.176:8077/api/v1/vendor/validate-reg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Validate vendor registration failed:', error);
        return {
            responseCode: 500,
            responseMessage: 'Network error occurred',
            data: null as String,
        };
    }
};

export const validateCustomerRegistration = async (payload: ValidateOTPPayload): Promise<ApiResponse<String>> => {
    try {
        const response = await fetch('http://45.33.68.176:9090/api/v1/customer/validate-reg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Validate customer registration failed:', error);
        return {
            responseCode: 500,
            responseMessage: 'Network error occurred',
            data: null as String,
        };
    }
};

export const forgotVendorPassword = async (payload: { email: string; password: string; otp: string }): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/api/vendor/forgot-password', payload, 'VENDOR_FORGOT_PASSWORD');
};

export const changeVendorPassword = async (payload: ChangeVendorPasswordPayload): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/api/vendor/change-password', payload, 'VENDOR_CHANGE_PASSWORD');
};

export const validateCustomerOTP = async (payload: ValidateOTPPayload): Promise<ApiResponse<String>> => {
    return apiRequest<String>('/api/customer/validate', payload, 'CUSTOMER_VALIDATE_OTP');
};

export const validateVendorOTP = async (payload: ValidateOTPPayload): Promise<ApiResponse<String>> => {
    return apiRequest<String>('/api/vendor/validate', payload, 'VENDOR_VALIDATE_OTP');
};

export const customerResetPassword = async (email: string): Promise<ApiResponse<any>> => {
    try {
        const response = await fetch(`/api/customer/reset-password?email=${encodeURIComponent(email)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('🔄 Customer Reset Password Frontend Response Status:', response.status);
        const data = await response.json();
        console.log('🔄 Customer Reset Password Frontend Response:', data);

        return data;
    } catch (error) {
        console.error('❌ Customer Reset Password Frontend Error:', error);
        return {
            responseCode: 500,
            responseMessage: 'Network error occurred',
            data: null,
        };
    }
};

export const customerResetPasswordFinal = async (email: string, otp: string, newPassword: string): Promise<ApiResponse<any>> => {
    try {
        const queryParams = new URLSearchParams({
            email,
            otp,
            newPassword,
        });

        const response = await fetch(`/api/customer/reset-password-final?${queryParams}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('🔄 Customer Reset Password Final Frontend Response Status:', response.status);
        const data = await response.json();
        console.log('🔄 Customer Reset Password Final Frontend Response:', data);

        return data;
    } catch (error) {
        console.error('❌ Customer Reset Password Final Frontend Error:', error);
        return {
            responseCode: 500,
            responseMessage: 'Network error occurred',
            data: null,
        };
    }
};