from sql_connection import get_sql_connection

def get_all_products(connection):
    cursor = connection.cursor()

    query = ("SELECT products.product_id, products.name, products.uom_id, products.price_per_unit, uom.uom_name FROM gs.products inner join gs.uom on products.uom_id=uom.uom_id;")

    cursor.execute(query)

    responce = []

    for (product_id, name, uom_id, price_per_unit, uom_name) in cursor:
        responce.append(
            {
                "product_id": product_id,
                "name": name,
                "uom_id": uom_id,
                "price_per_unit": price_per_unit,
                "uom_name": uom_name
            }
        )
    
    return responce

def insert_new_product(connection, product):
    cursor = connection.cursor()

    query = ("INSERT INTO gs.products (name, uom_id, price_per_unit) VALUES (%s, %s, %s)")
    data = (product['product_name'], product['uom_id'], product['price_per_unit'])

    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid

def update_product(connection, product):
    cursor = connection.cursor()
    query = """
        UPDATE gs.products 
        SET name = %s, 
            uom_id = %s, 
            price_per_unit = %s
        WHERE product_id = %s;"""
    data = (
        product['product_name'],
        product['uom_id'],
        product['price_per_unit'],
        product['product_id']
    )
    cursor.execute(query, data)
    connection.commit()

    return product['product_id']


def delete_product(connection, product_id):
    curesor = connection.cursor()
    query = ("DELETE FROM products WHERE product_id =" + str(product_id))
    curesor.execute(query)
    connection.commit()

if __name__ == "__main__":
    connection = get_sql_connection()
    print(delete_product(connection, 15))