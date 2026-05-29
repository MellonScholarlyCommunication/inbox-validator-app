import { VALIDATOR_URL } from "./globals";

export interface ValidationResult {
    data: string;
}

export interface ValidateOptions {
    api?: string;
}

export async function validateNotification(data: string, options: ValidateOptions = {}) : Promise<ValidationResult> {
    const api = options.api ?? VALIDATOR_URL;
    try {
        const response = await fetch(api, {
            method: "POST",
            body: data
        });

        if (! response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const json = await response.json();

        return {
            data: json.result
        } as ValidationResult;
    }
    catch (e) {
        throw new Error(`Failed to contact ${api}`);
    }
}