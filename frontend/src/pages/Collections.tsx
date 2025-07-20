import { Link } from 'react-router-dom';
import ProductCard from '../features/products/components/ProductCard';

const Collections = () => {
  // This is a placeholder for actual collection data.
  // In a real application, you would fetch collections and their products.
  const collections = [
    {
      _id: 'collection1',
      name: 'Men',
      products: [
        { _id: 'product1', name: 'Product A', price: 100, image: '/placeholder.svg' },
        { _id: 'product2', name: 'Product B', price: 200, image: '/placeholder.svg' },
      ],
    },
    {
      _id: 'collection2',
      name: 'Training',
      products: [
        { _id: 'product3', name: 'Product X', price: 50, image: '/placeholder.svg' },
        { _id: 'product4', name: 'Product Y', price: 75, image: '/placeholder.svg' },
      ],
    },
  ];

  return (
    <div>
      <h1>Collections</h1>
      {collections.map((collection) => (
        <div key={collection._id}>
          <h2>{collection.name}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {collection.products.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Collections; 