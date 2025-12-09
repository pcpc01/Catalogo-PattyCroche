
import { supabase } from './supabase';
import { Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    return (data || []).map((item: any) => ({
        ...item,
        name: item.name || 'Produto sem nome',
        category: item.category || 'Outros',
        image: item.photo_url || item.image || 'https://via.placeholder.com/300', // Fallback image
        price: Number(item.base_price) || Number(item.price) || 0, // Prioritize base_price
        additional_images: item.additional_images || [],
    }));
};

export const getCategories = async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('category');

    if (error) {
        console.error('Error fetching categories:', error);
        return ['Todos', 'Amigurumi', 'Moda', 'Decoração', 'Infantil']; // Fallback
    }

    const categories = Array.from(new Set(data.map((item: any) => item.category).filter(Boolean)));
    return ['Todos', ...categories.sort()];
};
