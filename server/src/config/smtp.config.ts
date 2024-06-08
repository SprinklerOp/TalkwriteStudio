import { createTransport } from "nodemailer";

const transporter = createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "dattaramparab181@gmail.com",
      pass: "yuwx vzra qtvy rosf",
    },
    secure: true,
  });
  
  export default transporter;