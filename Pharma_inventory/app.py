from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pymysql
from decimal import Decimal

app = Flask(__name__)  # No need for static_folder and template_folder parameters
CORS(app)

# Database connection configuration
def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='root',
        database='pharma_inventory',
        cursorclass=pymysql.cursors.DictCursor
    )

# Route for the index page
@app.route('/')
def index():
    return render_template('index.html')

# Route for index2.html
@app.route('/index2')
def index2():
    return render_template('index2.html')

# Route for admin_page.html
@app.route('/admin_page')
def admin_page():
    return render_template('admin_page.html')

# Route to fetch sales data based on the selected pharmacy

@app.route('/fetch_sales_data', methods=['POST'])
def fetch_sales_data():
    pharmacy_name = request.json.get('pharmacy_name')

    if not pharmacy_name:
        return jsonify({'error': 'Pharmacy name is required.'}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT pharmacy_id FROM pharmacystore WHERE pharmacy_name = %s", (pharmacy_name,))
            result = cursor.fetchone()
            if not result:
                return jsonify({"error": "Pharmacy not found"}), 404
            
            pharmacy_id = result['pharmacy_id']
            
            sql = """
                SELECT 
                    p.pharmacy_name, 
                    m.medicine_name, 
                    s.quantity, 
                    s.total_amount 
                FROM 
                    sales s
                JOIN 
                    medicines m ON s.medicine_id = m.medicine_id
                JOIN 
                    pharmacystore p ON s.pharmacy_id = p.pharmacy_id
                WHERE 
                    p.pharmacy_id = %s;
            """
            cursor.execute(sql, (pharmacy_id,))
            sales_data = cursor.fetchall()
            
            # Convert Decimal to string
            for sale in sales_data:
                sale['total_amount'] = str(sale['total_amount'])
                print(sales_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        connection.close()

    return jsonify({'sales': sales_data})



@app.route('/fetch_inventory_data', methods=['POST'])
def fetch_inventory_data():
    pharmacy_name = request.json.get('pharmacy_name')
    try:
        # Connect to the database
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Step 1: Get the pharmacy_id based on the pharmacy_name
            cursor.execute("SELECT pharmacy_id FROM pharmacystore WHERE pharmacy_name = %s", (pharmacy_name,))
            result = cursor.fetchone()
            if not result:
                return jsonify({"error": "Pharmacy not found"}), 404
            
            pharmacy_id = result['pharmacy_id']
            
            # Step 2: Fetch inventory data for the given pharmacy_id
            cursor.execute("""
                SELECT medicine_name, quantity, price_per_unit, 
                       (quantity * price_per_unit) AS total_price, 
                       purchase_date, prescription_date 
                FROM inventorymanagement 
                WHERE pharmacy_id = %s
            """, (pharmacy_id,))
            
            inventory_data = cursor.fetchall()
            
        # Return the data in JSON format
        return jsonify({"inventory": inventory_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@app.route('/fetch_prescription_data', methods=['POST'])
def fetch_prescription_data():
    prescription_id = request.json.get('prescription_id')

    if not prescription_id:
        return jsonify({'error': 'Prescription ID is required.'}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Query to fetch all prescription data based on the Prescription ID
            cursor.execute("""
                SELECT doctor_id, patient_id, medicine_name, dosage, frequency, start_date, end_date
                FROM prescriptiondetails
                WHERE prescription_id = %s
            """, (prescription_id,))
            print("testing..")
            # Fetch all rows matching the prescription ID
            prescriptions = cursor.fetchall()
            # print(prescriptions)
            if not prescriptions:
                return jsonify({'error': 'No prescriptions found with the given ID.'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        connection.close()

    # Return all fetched prescription data
    return jsonify({'prescriptions': prescriptions})


@app.route('/add_entity', methods=['POST'])
def add_entity():
    data = request.json
    user_id = data.get('user_id')
    username = data.get('username')
    phone_number = data.get('phone_number')
    password = data.get('password')
    admin = data.get('admin')

    # Check if all fields are provided
    if not user_id or not username or not phone_number or not password:
        return jsonify({'success': False, 'message': 'All fields are required.'}), 400

    # Insert data into the database
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO userauthentication (user_id, username, phone_number, password, admin)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (user_id, username, phone_number, password, admin))
        connection.commit()
        # Return a success response with the 'success' key set to True
        return jsonify({'success': True, 'message': f'{username} has been added as a { "Admin" if admin == 1 else "Manager" } successfully.'}), 200
    except pymysql.MySQLError as e:
        print(f"Error adding entity: {e}")
        # Return an error response with the 'success' key set to False
        return jsonify({'success': False, 'message': 'Error adding entity.'}), 500
    finally:
        connection.close()

@app.route('/validate_login', methods=['POST'])
def validate_login():
    data = request.json
    username = data.get('username')
    phone_number = data.get('phone_number')
    password = data.get('password')
    admin = data.get('admin')

    if not username or not phone_number or not password:
        return jsonify({'success': False, 'message': 'All fields are required.'}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Query to validate user credentials
            cursor.execute("""
                SELECT * FROM userauthentication 
                WHERE username = %s AND phone_number = %s AND password = %s AND admin = %s
            """, (username, phone_number, password, admin))
            
            user = cursor.fetchone()
            if user:
                return jsonify({'success': True, 'message': 'Login successful!'}), 200
            else:
                return jsonify({'success': False, 'message': 'Invalid credentials or user type.'}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        connection.close()

@app.route('/fetch_inventory_info', methods=['POST'])
def fetch_inventory_info():
    pharmacy_id = request.json.get('pharmacy_id')

    if not pharmacy_id:
        return jsonify({'error': 'Pharmacy ID is required.'}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT medicine_name, quantity, price_per_unit, 
                       (quantity * price_per_unit) AS total_price, 
                       purchase_date, prescription_date 
                FROM inventorymanagement 
                WHERE pharmacy_id = %s
            """, (pharmacy_id,))
            
            inventory_data = cursor.fetchall()

            if not inventory_data:
                return jsonify({'error': 'No inventory found for the given Pharmacy ID.'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        connection.close()

    return jsonify({'inventory': inventory_data})


@app.route('/fetch_bill_data', methods=['POST'])
def fetch_bill_data():
    # Log the received data
    prescription_id = request.json.get('prescription_id')
    print(f"Received Prescription ID: {prescription_id}")

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
                SELECT p.prescription_id, p.medicine_name, p.dosage, m.medicine_id, m.cost
                FROM prescriptiondetails p
                JOIN medicines m ON p.medicine_id = m.medicine_id
                WHERE p.prescription_id = %s;
            """
            cursor.execute(sql, (prescription_id,))
            fetched_data = cursor.fetchall()
            print(fetched_data)

            if not fetched_data:
                return jsonify({'error': 'No inventory found for the given Prescription ID.'}), 404

            # Transform the data
            fixed_bill_data = [
                {
                    'medicine_name': item['medicine_name'],
                    'dosage': item['dosage'],
                    'quantity': '1',  # Fixed quantity as string
                    'cost_per_unit': str(float(item['cost']))  # Convert Decimal to float and then to string
                }
                for item in fetched_data
            ]

            # Calculate the total price
            total_price = str(sum(float(item['cost_per_unit']) * int(item['quantity']) for item in fixed_bill_data))
            print(total_price)
            print("testing.....\n",fixed_bill_data)
            return jsonify({'bill': fixed_bill_data, 'total_price': total_price})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        connection.close()


if __name__ == '__main__':
    app.run(debug=True)
