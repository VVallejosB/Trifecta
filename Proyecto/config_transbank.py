from transbank.common.integration_type import IntegrationType
from transbank.webpay.webpay_plus.transaction import WebpayOptions

# Configuración para el ambiente de pruebas de Transbank
commerce_code = "597055555532"  # Código de comercio de pruebas
api_key = "597055555532"  # Llave API de pruebas
integration_type = IntegrationType.TEST  # Modo de integración: TEST para pruebas, LIVE para producción

# Crear las opciones para la transacción de Webpay Plus
options = WebpayOptions(api_key, commerce_code, integration_type)
