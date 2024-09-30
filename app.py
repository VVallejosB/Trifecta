# IMPORTACIÓN LIBRERIAS FLASK PARA GENERACIÓN DE API
from flask import Flask, request, jsonify
# IMPORTACIÓN DE LIBRERIA FLASK PARA DEFINIR POLITICAS DE ACCESO Y COMPARTICIÓN DE RECURSOS REMOTOS AL SERVICIO
from flask_cors import CORS
# IMPORTACIÓN DE LIBRERIA PARA CREAR CLIENTE API REST Y CONSUMIR APIS DE TERCEROS
import requests

app = Flask(__name__)
CORS(app)

# SE HABILITA ACCESO PARA API DESDE EL ORIGEN *
cors = CORS(app, resource={
    r"/api/v1/transbank/*": {
        "origins": "*"
    }
})

# MÉTODO QUE CREA LA CABECERA SOLICITADA POR TRANSBANK EN UN REQUEST (SOLICITUD)
def header_request_transbank():
    headers = { 
        # Tipo de autorización y autenticación
        "Authorization": "Token",
        # Llave de ambiente de pruebas de Transbank (modificar en producción)
        "Tbk-Api-Key-Id": "597055555532",
        "Tbk-Api-Key-Secret": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        'Referrer-Policy': 'origin-when-cross-origin',
    }
    return headers

# RUTA PARA CREAR UNA TRANSACCIÓN
@app.route('/api/v1/transbank/transaction/create', methods=['POST'])
def iniciar_transaccion():
    try:
        # Obtener los datos enviados desde el frontend
        data = request.json
        print('Datos recibidos: ', data)

        # Verificación de datos requeridos
        if not data.get('buy_order') or not data.get('session_id') or not data.get('amount') or not data.get('return_url'):
            return jsonify({"error": "Faltan datos necesarios para la transacción"}), 400
        
        # URL de Transbank para crear una transacción
        url = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions"
        headers = header_request_transbank()

        # Llamada a la API de Transbank para crear la transacción
        response = requests.post(url, json=data, headers=headers)
        
        # Verificación de si la respuesta es JSON
        if response.headers.get('Content-Type') == 'application/json':
            response_data = response.json()
            print('Respuesta de Transbank: ', response_data)
        else:
            response_data = {"error": "Respuesta inesperada de Transbank"}
            print('Respuesta de Transbank no es JSON')

        # Retorno de la respuesta de Transbank
        return jsonify(response_data), response.status_code

    except requests.exceptions.RequestException as e:
        print(f"Error en la solicitud a Transbank: {str(e)}")
        return jsonify({"error": f"Error en la solicitud a Transbank: {str(e)}"}), 500
    except Exception as e:
        print(f"Error en la creación de la transacción: {str(e)}")
        return jsonify({"error": f"Error en la creación de la transacción: {str(e)}"}), 500


# RUTA PARA CONFIRMAR UNA TRANSACCIÓN USANDO EL TOKEN
@app.route('/api/v1/transbank/transaction/commit/<string:tokenws>', methods=['PUT'])
def transbank_commit(tokenws):
    try:
        # URL de Transbank para confirmar una transacción
        url = f"https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/{tokenws}"
        headers = header_request_transbank()

        # Llamada a la API de Transbank para confirmar la transacción
        response = requests.put(url, headers=headers)
        
        # Verificación de si la respuesta es JSON
        if response.headers.get('Content-Type') == 'application/json':
            response_data = response.json()
            print('Respuesta de Transbank: ', response_data)
        else:
            response_data = {"error": "Respuesta inesperada de Transbank"}
            print('Respuesta de Transbank no es JSON')

        # Retorno de la respuesta de Transbank
        return jsonify(response_data), response.status_code

    except requests.exceptions.RequestException as e:
        print(f"Error en la solicitud a Transbank: {str(e)}")
        return jsonify({"error": f"Error en la solicitud a Transbank: {str(e)}"}), 500
    except Exception as e:
        print(f"Error en la confirmación de la transacción: {str(e)}")
        return jsonify({"error": f"Error en la confirmación de la transacción: {str(e)}"}), 500


# RUTA PARA CANCELAR O REVERTIR UNA TRANSACCIÓN USANDO EL TOKEN
@app.route('/api/v1/transbank/transaction/reverse-or-cancel/<string:tokenws>', methods=['POST'])
def transbank_reverse_or_cancel(tokenws):
    try:
        # Obtener los datos enviados desde el frontend
        data = request.json
        print('Datos recibidos: ', data)

        # Verificación de monto en la solicitud
        if not data.get('amount'):
            return jsonify({"error": "Falta el monto para cancelar o revertir la transacción"}), 400
        
        # URL de Transbank para cancelar o revertir una transacción
        url = f"https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/{tokenws}/refunds"
        headers = header_request_transbank()

        # Llamada a la API de Transbank para cancelar o revertir la transacción
        response = requests.post(url, json=data, headers=headers)
        
        # Verificación de si la respuesta es JSON
        if response.headers.get('Content-Type') == 'application/json':
            response_data = response.json()
            print('Respuesta de Transbank: ', response_data)
        else:
            response_data = {"error": "Respuesta inesperada de Transbank"}
            print('Respuesta de Transbank no es JSON')

        # Retorno de la respuesta de Transbank
        return jsonify(response_data), response.status_code

    except requests.exceptions.RequestException as e:
        print(f"Error en la solicitud a Transbank: {str(e)}")
        return jsonify({"error": f"Error en la solicitud a Transbank: {str(e)}"}), 500
    except Exception as e:
        print(f"Error en la cancelación de la transacción: {str(e)}")
        return jsonify({"error": f"Error en la cancelación de la transacción: {str(e)}"}), 500

# DESPLIEGUE DEL SERVICIO EN PUERTO 8900 PARA PRUEBAS
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8900, debug=True)


  
