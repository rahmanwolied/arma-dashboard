ALTER TYPE "public"."address_type" RENAME TO "address_type_enum";--> statement-breakpoint
CREATE TABLE "districts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"division_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_bengali" varchar(255),
	CONSTRAINT "districts_name_unique" UNIQUE("name"),
	CONSTRAINT "districts_name_bengali_unique" UNIQUE("name_bengali")
);
--> statement-breakpoint
CREATE TABLE "divisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_bengali" varchar(255),
	CONSTRAINT "divisions_name_unique" UNIQUE("name"),
	CONSTRAINT "divisions_name_bengali_unique" UNIQUE("name_bengali")
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"district_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_bengali" varchar(255),
	"post_code" varchar(10)
);
--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "address_type" SET DEFAULT 'HOME';--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "division_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "district_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "zone_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "address_line" text NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "landmark" text;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "details" jsonb;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "districts" ADD CONSTRAINT "districts_division_id_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."divisions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zones" ADD CONSTRAINT "zones_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_division_id_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."divisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "country";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "division";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "district";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "postal_code";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "latitude";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "longitude";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "region_specific_fields";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "updated_by";--> statement-breakpoint
ALTER TABLE "cattle_class_thresholds" DROP COLUMN "farm_id";--> statement-breakpoint
ALTER TABLE "cattle_class_thresholds" DROP COLUMN "priority";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "farm_id";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "updated_by";--> statement-breakpoint
ALTER TABLE "weight_records" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "weight_records" DROP COLUMN "created_by";