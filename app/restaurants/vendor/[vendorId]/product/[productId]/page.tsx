import React from 'react';
import RestaurantProductClient from './RestaurantProductClient';

const RestaurantProductPage = async ({ params }: { params: Promise<{ vendorId: string; productId: string }> }) => {
  const { vendorId, productId } = await params;

  // Mock restaurant product data
  const productData = {
    id: productId,
    name: 'Jollof Rice with Grilled Chicken',
    price: 4500,
    originalPrice: 5000,
    restaurant: 'Nkoyo Restaurant',
    location: 'Victoria Island, Lagos',
    rating: 4.8,
    reviewsCount: 124,
    preparationTime: '15-20 min',
    deliveryTime: '25-35 min',
    cuisine: 'Nigerian',
    category: 'Main Course',
    images: [
      '/images/menu-item-1-3f0b44.png',
      '/images/menu-item-2-3f0b44.png',
      '/images/menu-item-3-3f0b44.png',
      '/images/menu-item-4-3f0b44.png'
    ],
    description: `Experience the authentic taste of Nigeria with our signature Jollof Rice with Grilled Chicken. This traditional dish features perfectly cooked basmati rice infused with rich tomato sauce, aromatic spices, and tender grilled chicken breast.

Our Jollof rice is prepared using a secret family recipe passed down through generations, ensuring an authentic and unforgettable dining experience. The grilled chicken is marinated in a special blend of Nigerian spices and herbs, then cooked to perfection.

This dish is perfect for those who want to experience true Nigerian cuisine in a modern, comfortable setting.`,
    ingredients: [
      'Basmati Rice',
      'Fresh Tomatoes',
      'Onions',
      'Bell Peppers',
      'Chicken Breast',
      'Nigerian Spices',
      'Vegetable Oil',
      'Garlic',
      'Ginger'
    ],
    allergens: [
      'Contains: Gluten',
      'May contain: Nuts',
      'Contains: Dairy'
    ],
    nutritionInfo: {
      calories: '650 kcal',
      protein: '35g',
      carbs: '45g',
      fat: '20g',
      fiber: '3g'
    },
    sizes: [
      { name: 'Small', price: 3500, description: 'Perfect for one person' },
      { name: 'Regular', price: 4500, description: 'Standard portion' },
      { name: 'Large', price: 5500, description: 'Extra large portion' }
    ],
    addons: [
      { name: 'Extra Chicken', price: 800 },
      { name: 'Fried Plantain', price: 500 },
      { name: 'Coleslaw', price: 300 },
      { name: 'Extra Spice', price: 200 },
      { name: 'Soft Drink', price: 400 }
    ],
    reviews: [
      {
        id: 1,
        author: 'Adebayo Okafor',
        comment: 'Absolutely delicious! The jollof rice was perfectly cooked and the chicken was tender and flavorful. This is authentic Nigerian cuisine at its best.',
        timeAgo: '2 days ago',
        avatar: '/images/accommodation-card-1.png',
        rating: 5
      },
      {
        id: 2,
        author: 'Sarah Johnson',
        comment: 'The best jollof rice I\'ve had outside of Nigeria. The spices are perfectly balanced and the portion size is generous. Highly recommend!',
        timeAgo: '1 week ago',
        avatar: '/images/accommodation-card-2.png',
        rating: 5
      },
      {
        id: 3,
        author: 'Michael Chen',
        comment: 'Great value for money. The chicken was perfectly grilled and the rice had the right texture. Will definitely order again.',
        timeAgo: '3 days ago',
        avatar: '/images/accommodation-card-3.png',
        rating: 4
      },
      {
        id: 4,
        author: 'Emma Williams',
        comment: 'Authentic taste and excellent presentation. The restaurant clearly knows how to prepare traditional Nigerian dishes properly.',
        timeAgo: '5 days ago',
        avatar: '/images/accommodation-card-1.png',
        rating: 5
      },
      {
        id: 5,
        author: 'David Thompson',
        comment: 'Fast delivery and the food arrived hot and fresh. The jollof rice was perfectly seasoned and the chicken was juicy.',
        timeAgo: '1 week ago',
        avatar: '/images/accommodation-card-2.png',
        rating: 4
      }
    ],
    relatedProducts: [
      {
        id: 2,
        name: 'Pepper Soup with Fish',
        price: 3500,
        image: '/images/menu-item-2-3f0b44.png',
        rating: 4.6,
        preparationTime: '10-15 min'
      },
      {
        id: 3,
        name: 'Pounded Yam with Egusi Soup',
        price: 4000,
        image: '/images/menu-item-3-3f0b44.png',
        rating: 4.7,
        preparationTime: '20-25 min'
      },
      {
        id: 4,
        name: 'Suya (Grilled Beef)',
        price: 2500,
        image: '/images/menu-item-4-3f0b44.png',
        rating: 4.5,
        preparationTime: '10-15 min'
      },
      {
        id: 5,
        name: 'Fried Rice with Plantain',
        price: 4200,
        image: '/images/menu-item-5-3f0b44.png',
        rating: 4.4,
        preparationTime: '15-20 min'
      }
    ],
    faqs: [
      {
        id: 1,
        question: 'How spicy is this dish?',
        answer: 'Our Jollof Rice has a mild to medium spice level. We use traditional Nigerian spices that provide flavor without being overly hot. If you prefer it spicier or milder, please let us know in the special instructions.',
        isOpen: true
      },
      {
        id: 2,
        question: 'Can I customize the ingredients?',
        answer: 'Yes, you can customize your order! We can substitute or add ingredients based on your preferences. Please mention any changes in the special instructions when placing your order.',
        isOpen: false
      },
      {
        id: 3,
        question: 'Is this dish suitable for vegetarians?',
        answer: 'This particular dish contains chicken, so it\'s not suitable for vegetarians. However, we do offer a vegetarian version with grilled vegetables instead of chicken. Please check our menu for vegetarian options.',
        isOpen: false
      },
      {
        id: 4,
        question: 'What is the delivery time?',
        answer: 'Our standard delivery time is 25-35 minutes, depending on your location. During peak hours, it may take slightly longer. We\'ll keep you updated on your order status.',
        isOpen: false
      },
      {
        id: 5,
        question: 'Can I order this for a large group?',
        answer: 'Absolutely! We can prepare this dish for groups of any size. For orders of 10 or more, please call us directly to ensure we have enough ingredients and can accommodate your timing needs.',
        isOpen: false
      },
      {
        id: 6,
        question: 'What payment methods do you accept?',
        answer: 'We accept cash on delivery, card payments, and mobile money transfers. You can also pay online through our secure payment gateway for faster processing.',
        isOpen: false
      }
    ]
  };

  return <RestaurantProductClient vendorId={vendorId} productId={productId} productData={productData} />;
};

export default RestaurantProductPage;