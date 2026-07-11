# 📊 Data Dictionary Documentation

## 1. users Table

| Column Name | Data Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| **user_id (PK)** | SERIAL | PRIMARY KEY, NOT NULL | Unique identifier for each user |
| **firstname** | VARCHAR(50) | NOT NULL | First name of user |
| **lastname** | VARCHAR(50) | NOT NULL | Last name of user |
| **email** | VARCHAR(150) | UNIQUE, NOT NULL | Unique account email login |
| **password** | TEXT | NOT NULL | Hashed password string (bcrypt) |
| **role** | VARCHAR(20) | NOT NULL, DEFAULT 'Customer' | Role check: 'Guest', 'Customer', 'Employee', 'Owner' |
| **created_at** | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Signup timestamp |

---

## 2. categories Table

| Column Name | Data Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| **category_id (PK)** | SERIAL | PRIMARY KEY, NOT NULL | Unique category key |
| **category_name** | VARCHAR(50) | UNIQUE, NOT NULL | Cars, Trucks, SUVs, Vans, etc. |

---

## 3. vehicles Table

| Column Name | Data Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| **vehicle_id (PK)** | SERIAL | PRIMARY KEY, NOT NULL | Unique vehicle key |
| **category_id (FK)** | INT | NOT NULL, REFERENCES categories | Link to categorizing table |
| **make** | VARCHAR(50) | NOT NULL | e.g., Toyota, Ford, Honda |
| **model** | VARCHAR(50) | NOT NULL | e.g., Camry, F-150, Civic |
| **year** | INT | NOT NULL, Check range | Vehicle build year |
| **mileage** | INT | NOT NULL, Check >= 0 | Current vehicle mileage odometer |
| **price** | NUMERIC(10,2) | NOT NULL, Check >= 0.00 | Sales price tag |
| **description** | TEXT | NULL | Vehicle breakdown features list |
| **availability** | BOOLEAN | NOT NULL, DEFAULT TRUE | TRUE if active, FALSE if unavailable/hold |

---

## 4. vehicle_images Table

| Column Name | Data Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| **image_id (PK)** | SERIAL | PRIMARY KEY, NOT NULL | Unique image record key |
| **vehicle_id (FK)** | INT | NOT NULL, REFERENCES vehicles | Parent car mapping |
| **image_path** | TEXT | NOT NULL | URL path string to asset repository |

---

## 5. reviews Table

| Column Name | Data Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| **review_id (PK)** | SERIAL | PRIMARY KEY, NOT NULL | Unique review identifier |
| **user_id (FK)** | INT | NOT NULL, REFERENCES users | Submitting reviewer customer ID |
| **vehicle_id (FK)** | INT | NOT NULL, REFERENCES vehicles | Reviewed item profile target |
| **rating** | INT | NOT NULL, Check 1 to 5 | Rating numerical value |
| **review_text** | TEXT | NOT NULL | Feedback entry |
| **created_at** | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Logging generation moment |

---

## 6. service_requests Table (Optional)

| Column Name | Data Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| **request_id (PK)** | SERIAL | PRIMARY KEY, NOT NULL | Work request ticket tracker |
| **user_id (FK)** | INT | NOT NULL, REFERENCES users | Client customer reference ID |
| **vehicle_id (FK)** | INT | NOT NULL, REFERENCES vehicles | Target vehicle under maintenance |
| **service_type** | VARCHAR(100) | NOT NULL | Type (e.g., Oil Change, Brake Fix) |
| **notes** | TEXT | NULL | Client specifications details description |
| **status** | VARCHAR(20) | DEFAULT 'Submitted' | Check: 'Submitted', 'In Progress', 'Completed' |
| **employee_notes** | TEXT | NULL | Technician review/internal updates text block |
| **created_at** | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Initial execution filing moment |

---

## 7. contact_messages Table (Optional)

| Column Name | Data Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| **message_id (PK)** | SERIAL | PRIMARY KEY, NOT NULL | Lead tracker ID |
| **firstname** | VARCHAR(50) | NOT NULL | First name of guest/user |
| **lastname** | VARCHAR(50) | NOT NULL | Last name of guest/user |
| **email** | VARCHAR(150) | NOT NULL | Contact notification back address |
| **message** | TEXT | NOT NULL | Stored text string question text |
| **created_at** | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Form submission time |