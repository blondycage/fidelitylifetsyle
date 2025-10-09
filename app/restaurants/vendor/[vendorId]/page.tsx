import React from 'react';
import RestaurantVendorClient from './RestaurantVendorClient';

const RestaurantVendorPage = async ({ params }: { params: Promise<{ vendorId: string }> }) => {
  const { vendorId } = await params;

  // Mock restaurant vendor data based on the restaurant ID
  const restaurantData = {
    id: vendorId,
    name: 'Nkoyo Restaurant',
    location: '1 Ozumba Mbadiwe Avenue, Victoria Island, Lagos, Nigeria - show on map',
    rating: 4.8,
    reviews: 124,
    cuisine: 'Nigerian',
    priceRange: '₦₦₦₦',
    deliveryTime: '25-35 min',
    description: 'Experience authentic Nigerian cuisine in a modern setting with stunning lagoon views.',
    menuItems: [
      {
        id: 1,
        name: 'Jollof Rice with Grilled Chicken',
        price: 4500,
        image: '/images/menu-item-1-3f0b44.png',
        description: 'Traditional Nigerian jollof rice served with perfectly grilled chicken',
        category: 'Main Course',
        preparationTime: '15-20 min'
      },
      {
        id: 2,
        name: 'Pepper Soup with Fish',
        price: 3500,
        image: '/images/menu-item-2-3f0b44.png',
        description: 'Spicy Nigerian pepper soup with fresh fish and vegetables',
        category: 'Soup',
        preparationTime: '10-15 min'
      },
      {
        id: 3,
        name: 'Pounded Yam with Egusi Soup',
        price: 4000,
        image: '/images/menu-item-3-3f0b44.png',
        description: 'Traditional pounded yam served with rich egusi soup',
        category: 'Main Course',
        preparationTime: '20-25 min'
      },
      {
        id: 4,
        name: 'Suya (Grilled Beef)',
        price: 2500,
        image: '/images/menu-item-4-3f0b44.png',
        description: 'Spicy grilled beef skewers with onions and tomatoes',
        category: 'Appetizer',
        preparationTime: '10-15 min'
      },
      {
        id: 5,
        name: 'Fried Rice with Plantain',
        price: 4200,
        image: '/images/menu-item-5-3f0b44.png',
        description: 'Nigerian-style fried rice with sweet plantain',
        category: 'Main Course',
        preparationTime: '15-20 min'
      },
      {
        id: 6,
        name: 'Bitterleaf Soup with Fufu',
        price: 3800,
        image: '/images/menu-item-6-3f0b44.png',
        description: 'Traditional bitterleaf soup served with fufu',
        category: 'Soup',
        preparationTime: '25-30 min'
      }
    ]
  };


  return <RestaurantVendorClient vendorId={vendorId} restaurantData={restaurantData} />;
};

export default RestaurantVendorPage;