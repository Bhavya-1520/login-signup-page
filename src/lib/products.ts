export interface Product {
  id: string;
  name: string;
  category: string;
  group?: string;
  description: string;
  basePrice: number;
  image: string;
  images?: string[];
  sizes?: { label: string; flowers?: number; price: number }[];
  variants?: { label: string; priceAdjust: number }[];
  customizable: boolean;
  pricePerExtra?: number;
}

export const products: Product[] = [
  {
    id: "satin-ribbon-bouquet",
    name: "Satin Ribbon Rose Bouquet",
    category: "Satin Ribbon",
    group: "Bouquets",
    description: "Elegant handcrafted satin ribbon roses that last forever. Choose the number of flowers to create your perfect bouquet.",
    basePrice: 199,
    image: "/images/satin boquet.png",
    images: ["/images/satin boquet.png", "/images/Satinroseboquet2.jpeg"],
    customizable: true,
    pricePerExtra: 100,
  },
  {
    id: "pipe-cleaner-bouquet",
    name: "Pipe Cleaner Flower Bouquet",
    category: "Pipe Cleaner",
    group: "Bouquets",
    description: "Cute and colorful pipe cleaner flowers in vibrant colors of your choice. Available in single or bundle sizes.",
    basePrice: 99,
    image: "/images/NormalPipecleanerboquet.jpeg",
    sizes: [
      { label: "Single", flowers: 1, price: 99 },
      { label: "Small", flowers: 3, price: 199 },
      { label: "Medium", flowers: 6, price: 249 },
      { label: "Large", flowers: 10, price: 399 },
    ],
    customizable: true,
  },
  {
    id: "portrait-bouquet",
    name: "Portrait Photo Bouquet",
    category: "Special",
    group: "Bouquets",
    description: "A stunning bouquet made with your favourite photos arranged like flowers. Send us your pictures and we'll create a beautiful memory bouquet wrapped in pink with a ribbon bow. The perfect personalized gift!",
    basePrice: 299,
    image: "/images/Potrait Boquet.jpeg",
    customizable: true,
  },
  {
    id: "sunflower-bouquet",
    name: "Sunflower Bouquet",
    category: "Pipe Cleaner",
    group: "Bouquets",
    description: "Bright and cheerful handcrafted sunflower bouquet that brings sunshine to any room. Perfect for birthdays and celebrations.",
    basePrice: 249,
    image: "/images/SunFlowerBoquet.jpeg",
    customizable: true,
    pricePerExtra: 100,
  },
  {
    id: "birthday-card",
    name: "Birthday Card",
    category: "Gifts",
    group: "Birthday",
    description: "Beautifully handcrafted birthday card with creative designs. A unique and thoughtful way to wish your loved ones on their special day!",
    basePrice: 149,
    image: "/images/Birthdaycard.jpeg",
    images: ["/images/Birthdaycard.jpeg", "/images/Birthdaycard2.jpeg"],
    customizable: true,
  },
  {
    id: "birthday-hamper",
    name: "Birthday Hamper",
    category: "Gifts",
    group: "Birthday",
    description: "A complete birthday hamper with handcrafted goodies, perfect for surprising someone on their special day. Customizable to your preference!",
    basePrice: 399,
    image: "/images/BirthdayHamper.jpeg",
    customizable: true,
  },
  {
    id: "fridge-magnets",
    name: "Fridge Magnets",
    category: "Gifts",
    group: "Birthday",
    description: "Adorable handcrafted pipe cleaner fridge magnets. Choose any design and color you love — perfect for adding charm to your kitchen!",
    basePrice: 149,
    image: "/images/FridgeMagnetspipecleaner.jpeg",
    customizable: true,
  },
  {
    id: "magazine",
    name: "Personalized Magazine",
    category: "Special",
    group: "Birthday",
    description: "A beautifully handcrafted personalized magazine with your photos, memories, and messages. Perfect for birthdays, anniversaries, and special moments. Choose the number of sheets — each sheet adds more memories!",
    basePrice: 299,
    image: "/images/Magazine1.jpeg",
    images: [
      "/images/Magazine1.jpeg",
      "/images/Magazine2.jpeg",
      "/images/Magazine3.jpeg",
      "/images/Magazine4.jpeg",
      "/images/Magazine5.jpeg",
      "/images/Magazine6.jpeg",
    ],
    sizes: [
      { label: "2 Sheets", price: 299 },
      { label: "3 Sheets", price: 399 },
      { label: "4 Sheets", price: 499 },
      { label: "5 Sheets", price: 599 },
      { label: "6 Sheets", price: 699 },
    ],
    customizable: true,
  },
  {
    id: "resin-bangles",
    name: "Resin Bangles",
    category: "Resin Bangles",
    group: "Resin",
    description: "Stunning handcrafted resin bangles available in Blood Resin and Rose Resin styles. Choose your favourite type and size. Elegant and perfect for any occasion.",
    basePrice: 599,
    image: "/images/Resin Bangle.jpeg",
    variants: [
      { label: "Blood Resin", priceAdjust: 0 },
      { label: "Rose Resin", priceAdjust: 100 },
    ],
    sizes: [
      { label: "2-2", price: 599 },
      { label: "2-4", price: 649 },
      { label: "2-6", price: 699 },
      { label: "2-8", price: 749 },
    ],
    customizable: true,
  },
  {
    id: "raksha-bandhan-combo",
    name: "Customised Premium Decorated Horse & Letter Combo",
    category: "Raksha Bandhan",
    group: "Rakhi",
    description: "Complete Raksha Bandhan combo with a handcrafted decorated horse, traditional vintage letter, and Rakhi. Available in 6 inch and 12 inch horse sizes. Make this Raksha Bandhan unforgettable!",
    basePrice: 599,
    image: "/images/Horse+Letter.jpeg",
    sizes: [
      { label: "6 inch", price: 599 },
      { label: "12 inch", price: 1199 },
    ],
    customizable: true,
  },
  {
    id: "raksha-bandhan-horse",
    name: "Premium Decorated Horse",
    category: "Raksha Bandhan",
    group: "Rakhi",
    description: "A beautifully handcrafted premium decorated horse — the perfect standalone Raksha Bandhan gift for your sibling. Available in 6 inch and 12 inch sizes.",
    basePrice: 499,
    image: "/images/Horse.jpeg",
    sizes: [
      { label: "6 inch", price: 499 },
      { label: "12 inch", price: 1099 },
    ],
    customizable: true,
  },
];

export const categories = [
  "All",
  "Bouquets",
  "Rakhi",
  "Resin",
  "Birthday",
];
