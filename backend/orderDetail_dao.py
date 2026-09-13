from sql_connection import get_sql_connection

def get_order_details(connection, order_id):
    cursor = connection.cursor()

    query = """
        SELECT
            od.order_id,
            od.product_id,
            p.name,
            od.quantity,
            od.total_price,
            od.discount
        FROM gs.order_details od
        JOIN gs.products p
            ON od.product_id = p.product_id
        WHERE od.order_id = %s
    """

    cursor.execute(query, (order_id,))

    response = []

    for (
        order_id,
        product_id,
        name,
        quantity,
        total_price,
        discount
    ) in cursor:

        response.append({
            'order_id': order_id,
            'product_id': product_id,
            'name': name,
            'quantity': quantity,
            'total_price': total_price,
            'discount': discount
        })

    return response

def insert_new_order_detail(connection, order_detail):
    cursor = connection.cursor()

    query = """
        INSERT INTO gs.order_details
        (
            order_id,
            product_id,
            quantity,
            total_price,
            discount
        )
        VALUES (%s, %s, %s, %s, %s)
    """

    data = (
        order_detail['order_id'],
        order_detail['product_id'],
        order_detail['quantity'],
        order_detail['total_price'],
        order_detail['discount']
    )

    cursor.execute(query, data)
    connection.commit()

    return order_detail['order_id']

def delete_order_detail(connection, order_id, product_id):
    cursor = connection.cursor()

    query = """
        DELETE FROM gs.order_details
        WHERE order_id = %s
        AND product_id = %s
    """

    cursor.execute(query, (order_id, product_id))
    connection.commit()

    return order_id

def update_order_detail(connection, order_detail):
    cursor = connection.cursor()

    query = """
        UPDATE gs.order_details
        SET
            product_id = %s,
            quantity = %s,
            total_price = %s,
            discount = %s
        WHERE order_id = %s
        AND product_id = %s
    """

    data = (
        order_detail['product_id'],
        order_detail['quantity'],
        order_detail['total_price'],
        order_detail['discount'],
        order_detail['order_id'],
        order_detail['old_product_id']
    )

    cursor.execute(query, data)
    connection.commit()

    return order_detail['order_id']

def update_order_total(connection, order_id):
    cursor = connection.cursor()

    query = """
        SELECT SUM(total_price - discount)
        FROM gs.order_details
        WHERE order_id = %s
    """

    cursor.execute(query, (order_id,))
    result = cursor.fetchone()

    total = result[0] if result[0] else 0

    update_query = """
        UPDATE gs.orders
        SET total = %s
        WHERE order_id = %s
    """

    cursor.execute(
        update_query,
        (total, order_id)
    )

    connection.commit()

    return total

if __name__ == "__main__":
    connection = get_sql_connection()
    print(get_order_details(connection, 8))