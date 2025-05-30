import { Star, StarHalf } from "lucide-react";
import React from "react";

type StarRatingProps = {
  rating: number;
  maxStars?: number;
  starSize?: number;
  fullStarColor?: string;
  emptyStarColor?: string;
};

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  starSize = 24,
  fullStarColor = "#ffc107",
  emptyStarColor = "#e4e5e9",
}) => {
  // Calculate the number of full, half, and empty stars
  const fullStars = Math.floor(rating);
  const remainder = rating - fullStars;
  const hasHalfStar = remainder >= 0.3 && remainder <= 0.7; // Adjust threshold for half stars
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {/* Render full stars */}
      {Array.from({ length: fullStars }, (_, index) => (
        <Star
          key={`full-${index}`}
          size={starSize}
          fill={fullStarColor}
          color={fullStarColor}
        />
      ))}

      {/* Render half star if needed */}
      {hasHalfStar && (
        <StarHalf
          key="half"
          size={starSize}
          fill={fullStarColor}
          color={fullStarColor}
        />
      )}

      {/* Render empty stars */}
      {Array.from({ length: emptyStars }, (_, index) => (
        <Star
          key={`empty-${index}`}
          size={starSize}
          fill={emptyStarColor}
          color={emptyStarColor}
        />
      ))}
    </div>
  );
};

export default StarRating;
