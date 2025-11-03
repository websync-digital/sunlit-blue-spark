import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, Heart, Eye } from "lucide-react";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  toggleFavorite: () => void;
  setQuickViewProduct: (product: any) => void;
}

const ProductCard = ({ product, isFavorite, toggleFavorite, setQuickViewProduct }: ProductCardProps) => {
  const whatsappMessage = `Hi! I'm interested in the ${product.name} priced at ₦${product.price.toLocaleString()}`;
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
  const rating = 4.5; // Placeholder rating, can be from product data later

  return (
    <Card className="overflow-hidden border-2 border-border hover-lift hover-glow relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
        onClick={toggleFavorite}
      >
        <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
      </Button>
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-foreground">{product.name}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2 min-h-[3rem]">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between mb-2">
          <p className="text-2xl font-bold text-primary">₦{product.price.toLocaleString()}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : i < rating
                      ? 'fill-yellow-400/50 text-yellow-400'
                      : 'text-gray-300'
                  }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">({rating})</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => setQuickViewProduct(product)} className="flex-1">
            <Eye className="mr-1 h-3 w-3" />
            Quick View
          </Button>
          <Link to={`/product/${product.id}`} className="flex-1">
            <Button className="w-full rounded-lg font-medium">
              View Details
            </Button>
          </Link>
        </div>

      </CardFooter>
    </Card>
  );
};

export default ProductCard;
