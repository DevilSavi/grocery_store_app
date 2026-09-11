from sql_connection import get_sql_connection

def get_uoms(connection):
    cursor = connection.cursor()
    query = ("SELECT * FROM uom")
    cursor.execute(query)

    response = []
    for (uom_id, uom_name) in cursor:
      response.append({
        'uom_id': uom_id,
        'uom_name': uom_name
      })

    return response  

def insert_uom(connection, uom):
    cursor = connection.cursor()
    query = ("INSERT INTO uom (uom_name) VALUES (%s)")
    data = (uom['uom_name'],)
    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid

def update_uom(connection, uom):
    cursor = connection.cursor()
    query = ("UPDATE uom SET uom_name = %s WHERE uom_id = %s")
    data = (uom['uom_name'], uom['uom_id'])
    cursor.execute(query, data)
    connection.commit()

    return uom['uom_id']

def delete_uom(connection, uom_id):
    cursor = connection.cursor()
    query = ("DELETE FROM uom WHERE uom_id = %s")
    data = (uom_id,)
    cursor.execute(query, data)
    connection.commit()

if __name__ == '__main__':
    connection = get_sql_connection()
    print(get_uoms(connection))