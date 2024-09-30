from transbank.webpay.webpay_plus.transaction import Transaction
from config_transbank import options  # Importar las opciones de configuración desde config_transbank.py

# Función para iniciar una transacción con Transbank
def iniciar_transaccion(buy_order, session_id, amount, return_url):
    try:
        tx = Transaction(options=options)  # Inicializa la transacción con las opciones configuradas
        response = tx.create(buy_order, session_id, amount, return_url)
        return response  # Devuelve la respuesta de Transbank (url y token)
    except Exception as e:
        raise Exception(f"Error al iniciar la transacción: {str(e)}")

# Función para confirmar una transacción en el retorno de Transbank
def confirmar_transaccion(token):
    try:
        tx = Transaction(options=options)  # Inicializa la transacción con las opciones configuradas
        response = tx.commit(token)  # Confirmar la transacción con el token recibido
        return response  # Devuelve la respuesta de confirmación
    except Exception as e:
        raise Exception(f"Error al confirmar la transacción: {str(e)}")
