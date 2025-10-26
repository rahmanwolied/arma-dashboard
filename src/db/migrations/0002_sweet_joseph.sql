ALTER TYPE "public"."discount_type" ADD VALUE 'WEIGHT_BASED';--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid,
	"market_id" uuid,
	"purchase_date" timestamp NOT NULL,
	"notes" text,
	"total_transport_cost" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
ALTER TABLE "markets" RENAME COLUMN "contact_info" TO "phone";--> statement-breakpoint
ALTER TABLE "vendors" RENAME COLUMN "contact_phone" TO "phone";--> statement-breakpoint
ALTER TABLE "vendors" RENAME COLUMN "contact_email" TO "email";--> statement-breakpoint
ALTER TABLE "animal_purchases" DROP CONSTRAINT "animal_purchases_vendor_id_vendors_id_fk";
--> statement-breakpoint
ALTER TABLE "animal_purchases" DROP CONSTRAINT "animal_purchases_market_id_markets_id_fk";
--> statement-breakpoint
ALTER TABLE "cattle" ALTER COLUMN "tag_number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "animal_purchases" ALTER COLUMN "animal_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "weight_records" ADD COLUMN "on_purchase" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "weight_records" ADD COLUMN "on_sale" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "animal_purchases" ADD COLUMN "purchase_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "districts" ADD COLUMN "code" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "divisions" ADD COLUMN "code" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "zones" ADD COLUMN "code" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_market_id_markets_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_purchases" ADD CONSTRAINT "animal_purchases_purchase_id_purchases_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animals" DROP COLUMN "farm_id";--> statement-breakpoint
ALTER TABLE "cattle" DROP COLUMN "cattle_number";--> statement-breakpoint
ALTER TABLE "cattle" DROP COLUMN "cattle_class";--> statement-breakpoint
ALTER TABLE "cattle" DROP COLUMN "class_computed_at";--> statement-breakpoint
ALTER TABLE "animal_purchases" DROP COLUMN "vendor_id";--> statement-breakpoint
ALTER TABLE "animal_purchases" DROP COLUMN "market_id";--> statement-breakpoint
ALTER TABLE "animal_purchases" DROP COLUMN "purchase_date";--> statement-breakpoint
ALTER TABLE "animal_purchases" DROP COLUMN "invoice_reference";--> statement-breakpoint
ALTER TABLE "animal_purchases" DROP COLUMN "transport_cost";--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "farm_id";--> statement-breakpoint
ALTER TABLE "districts" ADD CONSTRAINT "districts_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "divisions" ADD CONSTRAINT "divisions_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "zones" ADD CONSTRAINT "zones_code_unique" UNIQUE("code");