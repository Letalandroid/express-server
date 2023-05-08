import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

const api = express.Router();

api.get('/', (req, res) => {
  res.send('🚀 Server is running')
})

api.post('/', (req, res) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS
    },
    tls: { rejectUnauthorized: false }
  });

  transporter.verify(function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  const { email, name, dni, salida, destino } = req.body;
  const nBoleto = Math.round(Math.random() * 999);

  if (email && name && dni && salida && destino) {
    const mailOptions = {
      from: process.env.AUTH_USER,
      to: email,
      subject: `🚌 Reserva de Boleto N° ${nBoleto} para el Sr. ${name}`,
      html: `
			<div style='font-size: 18px; line-height: 30px;'>
				🔴 Sr. <b>${name}</b> con DNI: <b>${dni}</b>,
				su boleto ha sido registrado correctamente. 🎫<br />
				🚌 El bus <b>${nBoleto}</b> lo estará esperando encantadamente ☺️<br />
				⬆️ Salida: <b>${salida}</b><br />
				⬇️ Destino: <b>${destino}</b><br />
				🙏 Agradecemos el contar con nosotros 🫂<br />
			</div>
			<br />
			<img src='${process.env.CLIENT}/eppo_logo.png' alt='' />`
    };

    transporter.sendMail(mailOptions, (error) => {
      error ? console.log(error) : console.log('📨 Correo enviado. 📫');
    });
  } else {
    console.log('¡Datos incompletos!');
  }

  res.send(
    `<style>
			* {
				margin: 0;
				padding: 0;
			}

			p {
				margin: 15px;
			}

			div {
				margin: 0;
				padding: 0;
				height: 100vh;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 24px;
				font-family: Arial;
				text-align: center;
				padding: 0 400px;
				color: #fff;
				background: red;
			}
		</style>

		<div>
			<p>¡Felicidades <b>${name}</b>! el boleto N°<b>${nBoleto}</b> Ha sido registrado correctamente, le estará llegando un mensaje a su correo en breves.</p>
			<p>Redireccionando...</p>
		</div>

		<script>
			setTimeout(() => {
				window.location.href = '${process.env.CLIENT}';
			}, 5000);
		</script>`
  );
});

// Version the api
app.use('/api/v1', api);
