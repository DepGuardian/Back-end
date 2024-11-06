export interface AuthLoginDto {
    email: string;
    password: string;
    isSuperAdmin: boolean;
    tenantId?: string;
};

