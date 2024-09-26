from flask import Flask, request, jsonify, redirect
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.integration_type import IntegrationType
from transbank.webpay.webpay_plus.transaction import WebpayOptions
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Configuración de Transbank
commerce_code = "597055555532"  # Código de comercio de prueba
api_key = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"  # Llave API de prueba
integration_type = IntegrationType.TEST  # Entorno de pruebas
options = WebpayOptions(api_key, commerce_code, integration_type)

# Ruta para iniciar la transacción
@app.route('/iniciar-transaccion', methods=['POST'])
def iniciar_transaccion():
    try:
        # Datos de la transacción
        buy_order = "orden_compra_12345"
        session_id = "sesion_1234564"
        amount = 10000  # Cambia el monto según lo necesario
        return_url = "http://localhost:5000/retorno"  # URL de retorno

        # Iniciar la transacción en Transbank
        tx = Transaction(options=options)
        response = tx.create(buy_order, session_id, amount, return_url)

        # Devolver la URL y el token al frontend
        return jsonify({
            "url": response['url'],
            "token": response['token']
        })
    except Exception as e:
        # Imprimir el error en el log del servidor para ayudar con la depuración
        print(f"Error al iniciar la transacción: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Ruta para recibir el retorno de Transbank
@app.route('/retorno', methods=['POST'])
def retorno():
    token = request.form.get("token_ws")
    transaction = Transaction(options=options)
    try:
        # Confirmar la transacción
        response = transaction.commit(token)
        if response['status'] == 'AUTHORIZED':
            return "Pago exitoso"
        else:
            return "Error en el pago"
    except Exception as e:
        return f"Error al confirmar la transacción: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True)
