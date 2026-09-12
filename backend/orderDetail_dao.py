from sql_connection import get_sql_connection
from datetime import datetime

def get_order_details(connection, order_id):
    cursor = connection.cursor()
    # query = (f"SELECT * FROM order_details WHERE order_details.order_id = '{order_id}';")
    query = f"""
    SELECT 
        od.order_id,
        od.product_id,
        p.name,
        od.quantity,
        od.total_price,
        od.discount
    FROM gs.order_details od
    JOIN gs.products p ON od.product_id = p.product_id
    WHERE od.order_id = '{order_id}'
    """
    cursor.execute(query)

    response = []
    for (order_id, product_id, name, quantity, total_price, discount) in cursor:
        response.append({
            'order_id': order_id,
            'product_id': product_id,
            'name': name,
            'quantity': quantity,
            'total_price': total_price,
            'discount': discount
        })

    return response

if __name__ == "__main__":
    connection = get_sql_connection()
    print(get_order_details(connection, 8))