export type PasswordFieldName = {
    value: string;
    action: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    placeholder: string;
};
