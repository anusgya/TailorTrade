"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useCallback } from "react";
import { Star } from "lucide-react";
import Rating from "react-rating";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export function ReviewForm({ customer_id, seamster_id, setReviews }) {
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  });
  const { toast } = useToast();
  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  const handleRatingChange = useCallback((value) => {
    setReview((prev) => ({ ...prev, rating: value }));
  }, []);

  const handleCommentChange = useCallback((e) => {
    setReview((prev) => ({ ...prev, comment: e.target.value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customer_id,
          seamster_id: seamster_id,
          rating: review.rating,
          comment: review.comment,
        }),
      });

      if (response.ok) {
        showToast("Review posted successfully", "success");
        const newReview = await response.json();

        setReviews((prev) => [...prev, newReview]);

        // setReviews((prev) => [...prev, newReview]);
      } else {
        throw new Error("Failed to post review");
      }
    } catch (error) {
      console.error("Error posting review:", error);
      // Implement proper error handling here
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="rating">Add a rating</Label>
        <Rating
          emptySymbol={<Star fill="#E5E4E2" strokeWidth={0} />}
          fullSymbol={<Star fill="#FFC300" strokeWidth={0} />}
          fractions={2}
          onChange={handleRatingChange}
          initialRating={review.rating}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="review">Leave a comment</Label>
        <textarea
          className="rounded-md border border-neutral-300 focus:border-neutral-900"
          onChange={handleCommentChange}
          value={review.comment}
        />
      </div>
      <Button type="submit" className="w-full">
        Post
      </Button>
    </form>
  );
}
