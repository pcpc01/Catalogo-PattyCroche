
import { supabase } from './supabase';
import { Order } from '../types';

export const createOrder = async (orderData: Order) => {
    const { data, error } = await supabase
        .from('customer_orders')
        .insert([
            {
                order_number: orderData.order_number,
                customer_name: orderData.customer_name,
                customer_cep: orderData.customer_cep,
                items: orderData.items,
                total_products: orderData.total_products,
                shipping_cost: orderData.shipping_cost,
                shipping_method: orderData.shipping_method,
                total_general: orderData.total_general,
                status: orderData.status,
                created_at: new Date().toISOString()
            }
        ])
        .select();

    if (error) {
        console.error('Error creating order:', error);
        throw error;
    }

    return data[0];
};
