const axios = require('axios');
const { accessToken, phoneId, graphApiUrl } = require('../config');

class WhatsAppService {
  async sendTemplate(to, templateName, languageCode, components) {
    const url = `${graphApiUrl}/${phoneId}/messages`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components
      }
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error sending template:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendSignupTemplate(to) {
    const components = [
      {
        type: 'button',
        sub_type: 'flow',
        index: '0',
        parameters: [
          {
            type: 'action',
            action: {
              flow_token: '1676200556381311',
              flow_action_data: {
                screen: 'SING_UP',
                user_data: {
                  user_id: '12345',
                  referral_source: 'whatsapp_template'
                }
              }
            }
          }
        ]
      }
    ];

    return this.sendTemplate(to, 'budosc_signup', 'es_MX', components);
  }

  async sendMarketingTemplate(to, templateName, languageCode) {
    const url = `${graphApiUrl}/${phoneId}/messages`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode }
      }
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error sending marketing template:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendTextMessage(to, text) {
    const url = `${graphApiUrl}/${phoneId}/messages`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        body: text
      }
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error sending text message:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();