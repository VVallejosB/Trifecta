from flask import Flask, request, jsonify, redirect
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.integration_type import IntegrationType
from transbank.webpay.webpay_plus.transaction import WebpayOptions
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# Configuración de Transbank para la versión 5.x del SDK
commerce_code = "597055555532"  # Código de comercio de prueba
api_key = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"  # API Key de pruebas
integration_type = IntegrationType.TEST  # Entorno de pruebas (TEST)

# Crear las opciones para la transacción de Webpay Plus
options = WebpayOptions(api_key, commerce_code, integration_type)

# Ruta para iniciar la transacción
@app.route('/iniciar-transaccion', methods=['POST'])
def iniciar_transaccion():
    try:
        # Datos de la transacción
        buy_order = "orden_compra_12345"  # El ID de la orden de compra
        session_id = "sesion_1234564"  # Un ID de sesión para identificar la transacción
        amount = 10000  # Monto de la transacción (en pesos)
        return_url = "http://localhost:5000/retorno"  # URL de retorno para el resultado de la transacción

        # Iniciar la transacción con Transbank
        tx = Transaction(options=options)
        response = tx.create(buy_order, session_id, amount, return_url)

        # Devolver la URL y el token al frontend para redirigir al usuario
        return jsonify({
            "url": response['url'],
            "token": response['token']
        })
    except Exception as e:
        # Manejo de errores y log para entender mejor el problema
        app.logger.error(f"Error al iniciar la transacción: {str(e)}")
        return jsonify({"error": f"Error al iniciar la transacción: {str(e)}"}), 500

# Ruta para recibir el retorno de Transbank y confirmar la transacción
@app.route('/retorno', methods=['POST'])
def retorno():
    token = request.form.get("token_ws")  # Recuperar el token desde el formulario de retorno
    transaction = Transaction(options=options)
    
    try:
        # Confirmar la transacción usando el token de retorno
        response = transaction.commit(token)
        if response['status'] == 'AUTHORIZED':
            return "Pago exitoso"
        else:
            return f"Error en el pago, estado: {response['status']}"
    except Exception as e:
        # Manejo de errores en la confirmación de la transacción
        app.logger.error(f"Error al confirmar la transacción: {str(e)}")
        return f"Error al confirmar la transacción: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True)
