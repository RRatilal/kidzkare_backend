import axios from 'axios'

type sendOtpProps = {
    dialCode?: string;
    number?: string;
    numberToken?: string;
}

export async function sendOtp({numberToken, number, dialCode}: sendOtpProps) {
    const newDialCode = dialCode?.slice(1)
     const response = await axios({
        url: 'https://graph.facebook.com/v20.0/400505629821722/messages',
        method: 'POST',
        headers: {
    'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "messaging_product": "whatsapp",
            "to": `${newDialCode}${number}`,
            "type": "text",
            "text": {
                body: `${numberToken} é o teu código de confirmação do Kidzkare`
            }
        })
     })
     console.log("response", response.data)
}