const axios = require('axios');
const { P4VIT_API_BASE_URL, P4VIT_ENTERPRISE_ID } = require('../config');

class P4vitApi {
  async checkClient(phone) {
    try {
      // Formatear número a 12 dígitos
      const formattedPhone = this.formatPhone(phone);
      
      const url = `${P4VIT_API_BASE_URL}/api/v1/enterprises/${P4VIT_ENTERPRISE_ID}/clients/check/${formattedPhone}`;
      const response = await axios.get(url);
      
      return {
        exists: true,
        client: response.data.client
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return {
          exists: false,
          message: "Cliente no encontrado en esta empresa. Se recomienda registrar al cliente."
        };
      }
      throw error;
    }
  }

  async registerClient(phone, clientData) {
    // Formatear número a 12 dígitos
    const formattedPhone = this.formatPhone(phone);
    
    // URL CORREGIDA: /api/v1/clients en lugar de /api/v1/clients/check/...
    const url = `${P4VIT_API_BASE_URL}/api/v1/clients`;
    
    const data = {
      channel: "whatsapp",
      externalId: formattedPhone,
      enterpriseId: P4VIT_ENTERPRISE_ID,
      ...clientData
    };
    
    const response = await axios.post(url, data);
    return response.data;
  }

  // Método para formatear números de teléfono
  formatPhone(phone) {
    // Eliminar el '1' después de '52' si está presente
    return phone.startsWith('521') 
      ? '52' + phone.substring(3) 
      : phone;
  }
}

module.exports = new P4vitApi();