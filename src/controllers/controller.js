const WhatsAppService = require('../services/service');
const P4vitApi = require('../apis/api'); // Importamos la nueva API
const { verifyToken } = require('../config');

class WhatsAppController {
  verifyWebhook(req, res) {
    // ... (código existente sin cambios)
  }

  async handleWebhook(req, res) {
    try {
      console.log('Webhook recibido:', JSON.stringify(req.body, null, 2));
      
      const entry = req.body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];
      const from = message?.from; // Guardamos el número del remitente
      
      // Manejar mensajes de texto
      if (message?.type === 'text') {
        const textBody = message.text.body;
        
        if (/hola/i.test(textBody)) {
          // Verificar si el cliente existe
          const clientCheck = await P4vitApi.checkClient(from);
          
          if (clientCheck.exists) {
            // Cliente existe - enviar bienvenida personalizada
            const welcomeMessage = `¡Hola ${clientCheck.client.firstName}! Bienvenido de nuevo a Budo Sento Championship 🏆`;
            await WhatsAppService.sendTextMessage(from, welcomeMessage);
            
            // Enviar plantilla de marketing después de 1 segundo
            setTimeout(async () => {
              await WhatsAppService.sendMarketingTemplate(from, 'visit_budo_web', 'es_MX');
            }, 1000);
          } else {
            // Cliente no existe - enviar plantilla de registro
            await WhatsAppService.sendSignupTemplate(from);
          }
        }
      }
      // Manejar respuestas del formulario
      else if (message?.type === 'interactive' && 
               message?.interactive?.type === 'nfm_reply' &&
               message?.interactive?.nfm_reply?.name === 'flow') {
        
        try {
          const formData = JSON.parse(message.interactive.nfm_reply.response_json);
          console.log('Datos del formulario completado:', formData);
          
          // Mapeo de géneros para registro
          const genderMap = {
            '0_Hombre_': 'HOMBRE',
            '1_Mujer': 'MUJER',
            '2_Otro': 'OTRO'
          };
          
          // Preparar datos para registro
          const clientData = {
            firstName: formData.screen_0_Nombre_s_0,
            lastName: formData.screen_0_Primer_Apellido_1,
            dob: formData.screen_0_Fecha_de_Nacimiento_2,
            gender: genderMap[formData.screen_0_Genero_3] || 'OTRO'
          };
          
          // Registrar cliente
          const registrationResponse = await P4vitApi.registerClient(from, clientData);
          console.log('Cliente registrado:', registrationResponse);
          
          // Mapeo de géneros para mensaje
          const displayGenderMap = {
            '0_Hombre_': 'Hombre',
            '1_Mujer': 'Mujer',
            '2_Otro': 'Otro'
          };
          
          // Enviar mensaje de confirmación
          const confirmationMessage = `Gracias por registrarte en *Budo Sento Championship* 🏆
Tus datos son los siguientes:
Nombre: ${clientData.firstName}
Apellido: ${clientData.lastName}
Fecha de nacimiento: ${clientData.dob}
Género: ${displayGenderMap[formData.screen_0_Genero_3] || formData.screen_0_Genero_3}
Términos y condiciones: ${formData.screen_0_Estoy_de_acuerdo_con_los_trminos_y_condiciones_4 ? 'Aceptado' : 'Rechazado'}`;
          
          await WhatsAppService.sendTextMessage(from, confirmationMessage);
          
          // Enviar plantilla de marketing después de 2 segundos
          setTimeout(async () => {
            await WhatsAppService.sendMarketingTemplate(from, 'visit_budo_web', 'es_MX');
          }, 2000);
        } catch (error) {
          console.error('Error al procesar formulario:', error);
        }
      }
      
      res.sendStatus(200);
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.sendStatus(500);
    }
  }
}

module.exports = new WhatsAppController();