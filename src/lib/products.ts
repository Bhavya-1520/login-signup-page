export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  image: string;
  sizes?: { label: string; flowers: number; price: number }[];
  customizable: boolean;
  pricePerExtra?: number;
}

export const products: Product[] = [
  {
    id: "satin-ribbon-bouquet",
    name: "Satin Ribbon Rose Bouquet",
    category: "Satin Ribbon",
    description: "Elegant handcrafted satin ribbon roses that last forever. Choose the number of flowers to create your perfect bouquet.",
    basePrice: 199,
    image: "/images/satin-bouquet.jpg",
    customizable: true,
    pricePerExtra: 100,
  },
  {
    id: "pipe-cleaner-bouquet",
    name: "Pipe Cleaner Flower Bouquet",
    category: "Pipe Cleaner",
    description: "Cute and colorful pipe cleaner flowers in vibrant colors of your choice. Available in single or bundle sizes.",
    basePrice: 99,
    image: "/images/pipe-cleaner-bouquet.jpg",
    sizes: [
      { label: "Single", flowers: 1, price: 99 },
      { label: "Small", flowers: 3, price: 199 },
      { label: "Medium", flowers: 6, price: 249 },
      { label: "Large", flowers: 10, price: 399 },
    ],
    customizable: true,
  },
  {
    id: "fridge-magnets",
    name: "Pipe Cleaner Fridge Magnets",
    category: "Gifts",
    description: "Adorable handcrafted fridge magnets made from pipe cleaners. Choose any design and color you love.",
    basePrice: 149,
    image: "/images/fridge-magnets.jpg",
    customizable: true,
  },
  {
    id: "small-pots",
    name: "Pipe Cleaner Small Pots",
    category: "Gifts",
    description: "Tiny decorative pots with pipe cleaner flowers. Perfect desk or shelf décor that never wilts.",
    basePrice: 149,
    image: "/images/small-pots.jpg",
    customizable: true,
  },
  {
    id: "portrait-bouquet",
    name: "Portrait Picture Bouquet",
    category: "Special",
    description: "A unique bouquet featuring a portrait picture surrounded by beautiful handcrafted flowers. The perfect personalized gift.",
    basePrice: 299,
    image: "/images/portrait-bouquet.jpg",
    customizable: true,
  },
  {
    id: "accessories-bouquet",
    name: "Accessories Bouquet",
    category: "Special",
    description: "A creative bouquet made with accessories like clips, lipsticks, and more. Perfect for someone who loves style!",
    basePrice: 299,
    image: "/images/accessories-bouquet.jpg",
    customizable: true,
  },
  {
    id: "raksha-bandhan-combo",
    name: "Raksha Bandhan Special Combo",
    category: "Raksha Bandhan",
    description: "Complete combo with a traditional vintage letter, bouquet of your choice, Rakhi, and add-on gifts. Make this Raksha Bandhan unforgettable!",
    basePrice: 499,
    image: "/images/raksha-bandhan.jpg",
    customizable: true,
  },
];

export const categories = [
  "All",
  "Satin Ribbon",
  "Pipe Cleaner",
  "Gifts",
  "Special",
  "Raksha Bandhan",
];
