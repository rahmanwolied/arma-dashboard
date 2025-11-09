ALTER TABLE "animal_purchases" ADD COLUMN "adjusted_price" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "total_base_price" numeric(10, 2) NOT NULL;