import psycopg2
import argparse
from datetime import datetime, timedelta
import random
import uuid
from faker import Faker

fake = Faker('pt_BR')

# Configuração do banco
DB_CONFIG = {
    'host': 'localhost',
    'database': 'Nola',
    'user': 'postgres',
    'password': 'admin',
    'port': 5432
}

def connect_db():
    return psycopg2.connect(**DB_CONFIG)

def generate_base_data(conn, num_stores, num_products, num_items, num_customers):
    """Gera dados base: lojas, canais, clientes, produtos, itens, etc."""
    cur = conn.cursor()
    
    print("🏪 Gerando lojas...")
    stores = []
    for i in range(num_stores):
        store_id = str(uuid.uuid4())
        stores.append(store_id)
        cur.execute("""
            INSERT INTO stores (id, name, city, state, "isActive", "isOwn")
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (store_id, f"Loja {fake.company()}", fake.city(), fake.state_abbr(), True, random.choice([True, False])))
    
    print("📺 Gerando canais...")
    channels = []
    channel_data = [
        ('Balcão', 'P'),
        ('Delivery App', 'D'),
        ('Telefone', 'D'),
        ('WhatsApp', 'D'),
        ('Site', 'D')
    ]
    for name, type_ in channel_data:
        channel_id = str(uuid.uuid4())
        channels.append(channel_id)
        cur.execute("""
            INSERT INTO channels (id, name, type)
            VALUES (%s, %s, %s)
        """, (channel_id, name, type_))
    
    print("👥 Gerando clientes...")
    customers = []
    for i in range(num_customers):
        customer_id = str(uuid.uuid4())
        customers.append(customer_id)
        cur.execute("""
            INSERT INTO customers (id, "customerName", email, "phoneNumber", "birthDate")
            VALUES (%s, %s, %s, %s, %s)
        """, (customer_id, fake.name(), fake.email(), fake.phone_number(), fake.date_of_birth(minimum_age=18, maximum_age=80)))
    
    print("🏷️ Gerando sub-marcas...")
    subbrands = []
    for name in ['Premium', 'Express', 'Tradicional', 'Gourmet']:
        subbrand_id = str(uuid.uuid4())
        subbrands.append(subbrand_id)
        cur.execute("""
            INSERT INTO sub_brands (id, name)
            VALUES (%s, %s)
        """, (subbrand_id, name))
    
    print("💳 Gerando tipos de pagamento...")
    payment_types = []
    for desc in ['Dinheiro', 'Cartão Débito', 'Cartão Crédito', 'PIX', 'Vale Refeição', 'Vale Alimentação']:
        pt_id = str(uuid.uuid4())
        payment_types.append(pt_id)
        cur.execute("""
            INSERT INTO payment_types (id, description)
            VALUES (%s, %s)
        """, (pt_id, desc))
    
    print("📦 Gerando categorias...")
    categories = []
    cat_data = [
        ('Pizzas', 'P'),
        ('Bebidas', 'P'),
        ('Sobremesas', 'P'),
        ('Molhos', 'I'),
        ('Bordas', 'I'),
        ('Coberturas', 'I')
    ]
    for name, type_ in cat_data:
        cat_id = str(uuid.uuid4())
        categories.append((cat_id, type_))
        cur.execute("""
            INSERT INTO categories (id, name, type)
            VALUES (%s, %s, %s)
        """, (cat_id, name, type_))
    
    print("🍕 Gerando produtos...")
    products = []
    product_categories = [c for c in categories if c[1] == 'P']
    for i in range(num_products):
        product_id = str(uuid.uuid4())
        cat_id = random.choice(product_categories)[0]
        products.append(product_id)
        cur.execute("""
            INSERT INTO products (id, "categoryId", name)
            VALUES (%s, %s, %s)
        """, (product_id, cat_id, f"{fake.word().capitalize()} {random.choice(['Especial', 'Tradicional', 'Premium', 'Light'])}"))
    
    print("🧩 Gerando itens de customização...")
    items = []
    item_categories = [c for c in categories if c[1] == 'I']
    for i in range(num_items):
        item_id = str(uuid.uuid4())
        cat_id = random.choice(item_categories)[0]
        items.append(item_id)
        cur.execute("""
            INSERT INTO items (id, "categoryId", name)
            VALUES (%s, %s, %s)
        """, (item_id, cat_id, f"{fake.word().capitalize()}"))
    
    print("🎛️ Gerando grupos de opções...")
    option_groups = []
    for name in ['Adicional', 'Extra', 'Sem', 'Dobro']:
        og_id = str(uuid.uuid4())
        option_groups.append(og_id)
        cur.execute("""
            INSERT INTO option_groups (id, name)
            VALUES (%s, %s)
        """, (og_id, name))
    
    conn.commit()
    cur.close()
    
    return {
        'stores': stores,
        'channels': channels,
        'customers': customers,
        'subbrands': subbrands,
        'payment_types': payment_types,
        'products': products,
        'items': items,
        'option_groups': option_groups
    }

def generate_sales(conn, base_data, months):
    """Gera vendas com todos os relacionamentos"""
    cur = conn.cursor()
    
    start_date = datetime.now() - timedelta(days=months * 30)
    end_date = datetime.now()
    
    # Calcula número de vendas baseado no período
    num_sales = months * 30 * 50 * random.randint(20, 40)  # ~30-60k vendas por mês por loja
    
    print(f"💰 Gerando {num_sales:,} vendas...")
    
    batch_size = 1000
    sales_batch = []
    
    for i in range(num_sales):
        sale_id = str(uuid.uuid4())
        store_id = random.choice(base_data['stores'])
        channel_id = random.choice(base_data['channels'])
        customer_id = random.choice(base_data['customers']) if random.random() > 0.3 else None
        subbrand_id = random.choice(base_data['subbrands']) if random.random() > 0.4 else None
        created_at = fake.date_time_between(start_date=start_date, end_date=end_date)
        
        total_amount_items = round(random.uniform(20, 200), 2)
        total_discount = round(total_amount_items * random.uniform(0, 0.2), 2) if random.random() > 0.7 else 0
        total_increase = round(total_amount_items * random.uniform(0, 0.15), 2) if random.random() > 0.8 else 0
        delivery_fee = round(random.uniform(5, 15), 2) if random.random() > 0.5 else 0
        service_tax_fee = round(total_amount_items * 0.1, 2) if random.random() > 0.6 else 0
        total_amount = total_amount_items - total_discount + total_increase + delivery_fee + service_tax_fee
        value_paid = total_amount
        
        production_seconds = random.randint(300, 3600)
        delivery_seconds = random.randint(600, 5400) if delivery_fee > 0 else None
        people_quantity = random.randint(1, 8)
        
        status = random.choices(['Concluído', 'Cancelado', 'Em andamento'], weights=[0.85, 0.1, 0.05])[0]
        
        sales_batch.append((
            sale_id, store_id, channel_id, customer_id, subbrand_id, created_at,
            fake.name() if not customer_id else None, status,
            total_amount_items, total_discount, total_increase, delivery_fee,
            service_tax_fee, total_amount, value_paid, production_seconds,
            delivery_seconds, people_quantity, 'App' if random.random() > 0.5 else 'Loja'
        ))
        
        if len(sales_batch) >= batch_size:
            cur.executemany("""
                INSERT INTO sales (
                    id, "storeId", "channelId", "customerId", "subBrandId", "createdAt",
                    "customerName", "saleStatusDesc", "totalAmountItems", "totalDiscount",
                    "totalIncrease", "deliveryFee", "serviceTaxFee", "totalAmount",
                    "valuePaid", "productionSeconds", "deliverySeconds", "peopleQuantity", origin
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, sales_batch)
            conn.commit()
            
            # Gera dados relacionados para cada venda
            for sale_tuple in sales_batch:
                sale_id = sale_tuple[0]
                total_amount = sale_tuple[13]
                has_delivery = sale_tuple[16] is not None
                
                # Produtos vendidos (2-5 produtos por venda)
                num_products = random.randint(2, 5)
                for _ in range(num_products):
                    generate_product_sale(cur, sale_id, base_data)
                
                # Pagamentos (1-2 formas de pagamento)
                num_payments = random.randint(1, 2)
                remaining = total_amount
                for idx in range(num_payments):
                    payment_id = str(uuid.uuid4())
                    payment_type_id = random.choice(base_data['payment_types'])
                    value = remaining if idx == num_payments - 1 else round(remaining * random.uniform(0.3, 0.7), 2)
                    remaining -= value
                    is_online = payment_type_id not in [base_data['payment_types'][0]]  # Dinheiro é offline
                    
                    cur.execute("""
                        INSERT INTO payments (id, "saleId", "paymentTypeId", value, "isOnline")
                        VALUES (%s, %s, %s, %s, %s)
                    """, (payment_id, sale_id, payment_type_id, value, is_online))
                
                # Delivery (se aplicável)
                if has_delivery:
                    generate_delivery(cur, sale_id)
            
            conn.commit()
            sales_batch = []
            if (i + 1) % 10000 == 0:
                print(f"  ✅ {i + 1:,} vendas geradas...")
    
    # Insere lote restante
    if sales_batch:
        cur.executemany("""
            INSERT INTO sales (
                id, "storeId", "channelId", "customerId", "subBrandId", "createdAt",
                "customerName", "saleStatusDesc", "totalAmountItems", "totalDiscount",
                "totalIncrease", "deliveryFee", "serviceTaxFee", "totalAmount",
                "valuePaid", "productionSeconds", "deliverySeconds", "peopleQuantity", origin
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, sales_batch)
        
        for sale_tuple in sales_batch:
            sale_id = sale_tuple[0]
            total_amount = sale_tuple[13]
            has_delivery = sale_tuple[16] is not None
            
            num_products = random.randint(2, 5)
            for _ in range(num_products):
                generate_product_sale(cur, sale_id, base_data)
            
            num_payments = random.randint(1, 2)
            remaining = total_amount
            for idx in range(num_payments):
                payment_id = str(uuid.uuid4())
                payment_type_id = random.choice(base_data['payment_types'])
                value = remaining if idx == num_payments - 1 else round(remaining * random.uniform(0.3, 0.7), 2)
                remaining -= value
                is_online = payment_type_id not in [base_data['payment_types'][0]]
                
                cur.execute("""
                    INSERT INTO payments (id, "saleId", "paymentTypeId", value, "isOnline")
                    VALUES (%s, %s, %s, %s, %s)
                """, (payment_id, sale_id, payment_type_id, value, is_online))
            
            if has_delivery:
                generate_delivery(cur, sale_id)
        
        conn.commit()
    
    print(f"✅ Total: {num_sales:,} vendas geradas!")
    cur.close()

def generate_product_sale(cur, sale_id, base_data):
    """Gera um produto vendido com customizações"""
    product_sale_id = str(uuid.uuid4())
    product_id = random.choice(base_data['products'])
    quantity = random.randint(1, 3)
    base_price = round(random.uniform(15, 80), 2)
    total_price = base_price * quantity
    observations = fake.sentence() if random.random() > 0.8 else None
    
    cur.execute("""
        INSERT INTO product_sales (id, "saleId", "productId", quantity, "basePrice", "totalPrice", observations)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (product_sale_id, sale_id, product_id, quantity, base_price, total_price, observations))
    
    # Customizações (0-5 itens)
    num_customizations = random.randint(0, 5)
    for _ in range(num_customizations):
        item_product_sale_id = str(uuid.uuid4())
        item_id = random.choice(base_data['items'])
        option_group_id = random.choice(base_data['option_groups'])
        item_quantity = random.randint(1, 2)
        additional_price = round(random.uniform(0, 8), 2)
        price = additional_price * item_quantity
        
        cur.execute("""
            INSERT INTO item_product_sales (
                id, "productSaleId", "itemId", "optionGroupId", 
                quantity, "additionalPrice", price
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (item_product_sale_id, product_sale_id, item_id, option_group_id, item_quantity, additional_price, price))
        
        # Customizações aninhadas (0-2 itens)
        if random.random() > 0.7:
            num_nested = random.randint(0, 2)
            for _ in range(num_nested):
                nested_id = str(uuid.uuid4())
                nested_item_id = random.choice(base_data['items'])
                nested_og_id = random.choice(base_data['option_groups'])
                nested_qty = 1
                nested_price = round(random.uniform(0, 5), 2)
                
                cur.execute("""
                    INSERT INTO item_item_product_sales (
                        id, "itemProductSaleId", "itemId", "optionGroupId",
                        quantity, "additionalPrice", price
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (nested_id, item_product_sale_id, nested_item_id, nested_og_id, nested_qty, nested_price, nested_price))

def generate_delivery(cur, sale_id):
    """Gera dados de delivery para uma venda"""
    # Delivery Sale
    delivery_sale_id = str(uuid.uuid4())
    cur.execute("""
        INSERT INTO delivery_sales (
            id, "saleId", "courierName", "courierPhone", "courierType",
            "deliveryType", status, "deliveryFee", "courierFee"
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        delivery_sale_id, sale_id, fake.name(), fake.phone_number(),
        random.choice(['Próprio', 'App', 'Terceiro']),
        random.choice(['Moto', 'Carro', 'Bike']),
        random.choice(['Entregue', 'Em rota', 'Pendente']),
        round(random.uniform(5, 15), 2),
        round(random.uniform(3, 10), 2)
    ))
    
    # Delivery Address
    delivery_address_id = str(uuid.uuid4())
    cur.execute("""
        INSERT INTO delivery_addresses (
            id, "saleId", "deliverySaleId", street, number, complement,
            neighborhood, city, state, "postalCode", latitude, longitude
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        delivery_address_id, sale_id, delivery_sale_id,
        fake.street_name(), str(random.randint(1, 9999)),
        f"Apto {random.randint(1, 500)}" if random.random() > 0.5 else None,
        fake.bairro(), fake.city(), fake.state_abbr(),
        fake.postcode(), fake.latitude(), fake.longitude()
    ))

def main():
    parser = argparse.ArgumentParser(description='Gerador de dados para Nola Analytics')
    parser.add_argument('--months', type=int, default=6, help='Número de meses de dados')
    parser.add_argument('--stores', type=int, default=50, help='Número de lojas')
    parser.add_argument('--products', type=int, default=500, help='Número de produtos')
    parser.add_argument('--items', type=int, default=200, help='Número de itens de customização')
    parser.add_argument('--customers', type=int, default=10000, help='Número de clientes')
    
    args = parser.parse_args()
    
    print("🚀 Iniciando geração de dados...")
    print(f"📅 Período: {args.months} meses")
    print(f"🏪 Lojas: {args.stores}")
    print(f"🍕 Produtos: {args.products}")
    print(f"🧩 Itens: {args.items}")
    print(f"👥 Clientes: {args.customers}")
    print()
    
    conn = connect_db()
    
    try:
        base_data = generate_base_data(conn, args.stores, args.products, args.items, args.customers)
        generate_sales(conn, base_data, args.months)
        print("\n✅ Geração concluída com sucesso!")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == '__main__':
    main()
