import { useState } from 'react';
import { Scale, X } from 'lucide-react';
import { Button } from '../../../components/button';
import { useCompare } from '../CompareContext';
import { useToast } from '../../../hooks/useToast';
import { Product } from './ProductContext';

interface CompareButtonProps {
  product: Product;
  variant?: 'default' | 'icon';
  className?: string;
}

const CompareButton = ({ product, variant = 'default', className = '' }: CompareButtonProps) => {
  const { addToCompare, removeFromCompare, isInCompare, compareProducts } = useCompare();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const inCompare = isInCompare(product._id);

  const handleCompareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProcessing(true);

    if (inCompare) {
      removeFromCompare(product._id);
      toast({
        title: "Removed from Compare",
        description: `${product.name} has been removed from comparison.`,
      });
    } else {
      if (compareProducts.length >= 3) {
        toast({
          title: "Compare Limit Reached",
          description: "You can only compare up to 3 products at once.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      addToCompare(product);
      toast({
        title: "Added to Compare",
        description: `${product.name} has been added to comparison.`,
      });
    }

    setTimeout(() => {
      setIsProcessing(false);
    }, 300);
  };

  if (variant === 'icon') {
    return (
      <Button
        variant={inCompare ? 'default' : 'outline'}
        size="sm"
        onClick={handleCompareClick}
        disabled={isProcessing}
        className={`h-8 w-8 p-0 ${inCompare ? 'bg-blue-600 hover:bg-blue-700' : ''} ${className}`}
        title={inCompare ? 'Remove from compare' : 'Add to compare'}
      >
        {inCompare ? (
          <X className="h-4 w-4" />
        ) : (
          <Scale className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={inCompare ? 'default' : 'outline'}
      size="sm"
      onClick={handleCompareClick}
      disabled={isProcessing}
      className={`${inCompare ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''} ${className}`}
    >
      <Scale className="h-4 w-4 mr-2" />
      {isProcessing ? 'Processing...' : inCompare ? 'Remove from Compare' : 'Compare'}
    </Button>
  );
};

export default CompareButton;
