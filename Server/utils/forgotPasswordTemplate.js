const forgotPasswordTemplate = ({name, otp}) => {
    return `
        <p>Dear ${name},</p>
        <p>the otp is ${otp} and valid for 10 minutes.</p>
        
    `;
}

export default forgotPasswordTemplate;