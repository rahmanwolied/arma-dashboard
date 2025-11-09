ALTER TABLE "vendors" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "vendors" CASCADE;--> statement-breakpoint
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_vendor_id_vendors_id_fk";
--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "pickup_cost" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "hasil_cost" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "miscellaneous_cost" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "markets" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "purchases" DROP COLUMN "vendor_id";--> statement-breakpoint
ALTER TABLE "purchases" DROP COLUMN "total_transport_cost";