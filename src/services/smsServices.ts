import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

interface SmsTokenProps {
    dialCode: string;
    number: string;
    numberToken?: string;
}

export async function sendSmsToken({dialCode, number, numberToken}: SmsTokenProps) {
     await client.messages.create({
        from: process.env.TWILIO_NUMBER,
        to: `${dialCode + number}`,
        body: `Your verification code is: ${numberToken}
                #zlbI7U59p9z`
    })
}

export async function sendSmsNewUser({dialCode, number}: SmsTokenProps) {
    await client.messages.create({
        from: process.env.TWILIO_NUMBER,
        to: `${dialCode + number}`,
        body: `O seu número ${number}, foi adicionado como parente de uma criança`
    })
}
