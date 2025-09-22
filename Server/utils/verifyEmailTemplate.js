const verifyEmailTemplate = ({name, url}) => {
    return `
        <p>Dear ${name},</p>
        <p>Thank you for registering on BinkeyIt.</p>
        <a href=${url} style="color:white; background-color:blue; margin-top:10px">
        Verify your email
        </a>
    `;
}

export default verifyEmailTemplate;