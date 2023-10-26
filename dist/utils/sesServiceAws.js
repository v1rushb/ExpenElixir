import { SESClient } from "@aws-sdk/client-ses";
import { SendEmailCommand } from "@aws-sdk/client-ses";
const REGION = "eu-west-2";
const sesClient = new SESClient({
    region: REGION, credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
        secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
    }
});
const createSendEmailCommand = (toAddress, fromAddress, emailBody, emailSubject) => {
    return new SendEmailCommand({
        Destination: {
            ToAddresses: [
                toAddress,
            ],
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: emailBody,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: emailSubject,
            },
        },
        Source: fromAddress,
    });
};
<<<<<<< HEAD
export const sendEmail = async (emailBody, emailSubject) => {
    const sendEmailCommand = createSendEmailCommand("cs.bashar.herbawi@gmail.com", "cs.bashar.herbawi@gmail.com", emailBody, emailSubject);
=======
export const sendEmail = async (distEmail, sourceEmail, emailBody, emailSubject) => {
    const sendEmailCommand = createSendEmailCommand(distEmail, sourceEmail, emailBody, emailSubject);
>>>>>>> cb0ba2cd9df643339156b91aebbf2ed32f3b63cd
    try {
        return await sesClient.send(sendEmailCommand);
    }
    catch (e) {
        console.error("Failed to send email." + e);
        return e;
    }
};
//# sourceMappingURL=sesServiceAws.js.map