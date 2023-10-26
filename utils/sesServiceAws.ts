import { SESClient } from "@aws-sdk/client-ses";
import { SendEmailCommand } from "@aws-sdk/client-ses";


const REGION = "eu-west-2";
const sesClient = new SESClient({
    region: REGION, credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
        secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
    }
});

const createSendEmailCommand = (toAddress: string, fromAddress: string, emailBody: string, emailSubject: string) => {
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

export const sendEmail = async (emailBody: string, emailSubject: string) => {
    const sendEmailCommand = createSendEmailCommand(
        "cs.bashar.herbawi@gmail.com",
        "cs.bashar.herbawi@gmail.com",
        emailBody,
        emailSubject
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (e) {
        console.error("Failed to send email." + e);
        return e;
    }
};

