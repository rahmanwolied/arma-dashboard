CREATE TYPE "public"."address_type" AS ENUM('HOME', 'BUSINESS', 'DELIVERY');--> statement-breakpoint
CREATE TYPE "public"."animal_status" AS ENUM('ON_FARM', 'SOLD', 'SLAUGHTERED');--> statement-breakpoint
CREATE TYPE "public"."animal_type" AS ENUM('CATTLE', 'POULTRY', 'FISH', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."cattle_class" AS ENUM('GOLD', 'SILVER', 'PLATINUM');--> statement-breakpoint
CREATE TYPE "public"."discount_type" AS ENUM('FLAT', 'PERCENT');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."health_status" AS ENUM('HEALTHY', 'MINOR_ISSUE', 'SICK', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."meat_inventory_status" AS ENUM('AVAILABLE', 'SOLD', 'RESERVED');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'MOBILE_MONEY');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"address_type" "address_type" NOT NULL,
	"country" text NOT NULL,
	"division" text,
	"district" text,
	"city" text,
	"postal_code" text,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"region_specific_fields" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "animal_purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"animal_id" uuid,
	"vendor_id" uuid,
	"market_id" uuid,
	"purchase_date" timestamp NOT NULL,
	"purchase_price" numeric(10, 2) NOT NULL,
	"invoice_reference" text,
	"transport_cost" numeric(10, 2),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	CONSTRAINT "animal_purchases_animal_id_unique" UNIQUE("animal_id")
);
--> statement-breakpoint
CREATE TABLE "animals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"animal_type" "animal_type" NOT NULL,
	"status" "animal_status" DEFAULT 'ON_FARM' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"updated_by" uuid,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "calving_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mother_id" uuid NOT NULL,
	"calf_id" uuid,
	"calving_date" timestamp NOT NULL,
	"calving_difficulty" text,
	"veterinarian_assisted" boolean DEFAULT false NOT NULL,
	"calf_weight" numeric(10, 2),
	"complications" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "cattle" (
	"animal_id" uuid PRIMARY KEY NOT NULL,
	"cattle_number" text NOT NULL,
	"tag_number" text,
	"gender" "gender" NOT NULL,
	"health_status" "health_status" DEFAULT 'HEALTHY' NOT NULL,
	"is_quarantined" boolean DEFAULT false NOT NULL,
	"is_pregnant" boolean DEFAULT false NOT NULL,
	"is_lactating" boolean DEFAULT false NOT NULL,
	"cattle_class" "cattle_class",
	"class_computed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"updated_by" uuid,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cattle_class_thresholds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"class_name" "cattle_class" NOT NULL,
	"min_weight_kg" numeric(10, 2) NOT NULL,
	"max_weight_kg" numeric(10, 2),
	"priority" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"name" text NOT NULL,
	"primary_phone" text NOT NULL,
	"secondary_phone" text,
	"email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"updated_by" uuid,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "health_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"animal_id" uuid NOT NULL,
	"veterinarian_id" uuid,
	"diagnosis" text NOT NULL,
	"treatment" text NOT NULL,
	"notes" text,
	"cost" numeric(10, 2),
	"occurred_at" timestamp NOT NULL,
	"recorded_at" timestamp NOT NULL,
	"attachment_urls" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"animal_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"caption" text,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"uploaded_by" uuid
);
--> statement-breakpoint
CREATE TABLE "insemination_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cattle_id" uuid NOT NULL,
	"insemination_date" timestamp NOT NULL,
	"bull_id" uuid,
	"semen_source" text,
	"veterinarian_id" uuid,
	"expected_calving_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "lactation_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cattle_id" uuid NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"peak_milk_yield" numeric(10, 2),
	"total_milk_yield" numeric(10, 2),
	"lactation_number" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "markets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"location" text,
	"contact_info" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "meat_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "meat_inventories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meat_yield_id" uuid NOT NULL,
	"quantity_kg" numeric(10, 2) NOT NULL,
	"price_per_kg" numeric(10, 2) NOT NULL,
	"status" "meat_inventory_status" DEFAULT 'AVAILABLE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "meat_yields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slaughter_record_id" uuid NOT NULL,
	"meat_category_id" uuid NOT NULL,
	"gross_weight_kg" numeric(10, 2) NOT NULL,
	"net_weight_kg" numeric(10, 2) NOT NULL,
	"price_per_kg" numeric(10, 2) NOT NULL,
	"batch_number" text,
	"inventory_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sale_id" uuid NOT NULL,
	"paid_amount" numeric(10, 2) NOT NULL,
	"paid_at" timestamp NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"transaction_reference" text,
	"received_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "quarantine_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"animal_id" uuid NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"reason" text NOT NULL,
	"handled_by" uuid,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "sale_animal_links" (
	"sale_id" uuid NOT NULL,
	"animal_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sale_animal_links_sale_id_animal_id_pk" PRIMARY KEY("sale_id","animal_id")
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"customer_id" uuid,
	"slaughterhouse_id" uuid,
	"invoice_number" text NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2),
	"discount_type" "discount_type",
	"amount_paid" numeric(10, 2) NOT NULL,
	"amount_due" numeric(10, 2) NOT NULL,
	"is_credit" boolean DEFAULT false NOT NULL,
	"payment_terms" text,
	"sale_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "slaughter_houses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"name" text NOT NULL,
	"contact_phone" text,
	"contact_email" text,
	"location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "slaughter_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"animal_id" uuid NOT NULL,
	"slaughterhouse_id" uuid NOT NULL,
	"slaughter_date" timestamp NOT NULL,
	"slaughtered_by" uuid,
	"batch_number" text,
	"live_weight_kg" numeric(10, 2) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "vaccination_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"animal_id" uuid NOT NULL,
	"vaccine_id" uuid NOT NULL,
	"vaccination_date" timestamp NOT NULL,
	"batch_number" text,
	"next_due_date" timestamp,
	"administered_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "vaccines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"manufacturer" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"name" text NOT NULL,
	"contact_phone" text,
	"contact_email" text,
	"location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "veterinarians" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"license_number" text,
	"contact_phone" text,
	"contact_email" text,
	"specialization" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "weight_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"animal_id" uuid NOT NULL,
	"weight_kg" numeric(10, 2) NOT NULL,
	"recorded_at" timestamp NOT NULL,
	"recorded_by" uuid,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_purchases" ADD CONSTRAINT "animal_purchases_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_purchases" ADD CONSTRAINT "animal_purchases_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_purchases" ADD CONSTRAINT "animal_purchases_market_id_markets_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calving_events" ADD CONSTRAINT "calving_events_mother_id_cattle_animal_id_fk" FOREIGN KEY ("mother_id") REFERENCES "public"."cattle"("animal_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calving_events" ADD CONSTRAINT "calving_events_calf_id_cattle_animal_id_fk" FOREIGN KEY ("calf_id") REFERENCES "public"."cattle"("animal_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cattle" ADD CONSTRAINT "cattle_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insemination_records" ADD CONSTRAINT "insemination_records_cattle_id_cattle_animal_id_fk" FOREIGN KEY ("cattle_id") REFERENCES "public"."cattle"("animal_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insemination_records" ADD CONSTRAINT "insemination_records_veterinarian_id_veterinarians_id_fk" FOREIGN KEY ("veterinarian_id") REFERENCES "public"."veterinarians"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lactation_periods" ADD CONSTRAINT "lactation_periods_cattle_id_cattle_animal_id_fk" FOREIGN KEY ("cattle_id") REFERENCES "public"."cattle"("animal_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meat_inventories" ADD CONSTRAINT "meat_inventories_meat_yield_id_meat_yields_id_fk" FOREIGN KEY ("meat_yield_id") REFERENCES "public"."meat_yields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meat_yields" ADD CONSTRAINT "meat_yields_slaughter_record_id_slaughter_records_id_fk" FOREIGN KEY ("slaughter_record_id") REFERENCES "public"."slaughter_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meat_yields" ADD CONSTRAINT "meat_yields_meat_category_id_meat_categories_id_fk" FOREIGN KEY ("meat_category_id") REFERENCES "public"."meat_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quarantine_history" ADD CONSTRAINT "quarantine_history_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_animal_links" ADD CONSTRAINT "sale_animal_links_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_animal_links" ADD CONSTRAINT "sale_animal_links_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slaughter_records" ADD CONSTRAINT "slaughter_records_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slaughter_records" ADD CONSTRAINT "slaughter_records_slaughterhouse_id_slaughter_houses_id_fk" FOREIGN KEY ("slaughterhouse_id") REFERENCES "public"."slaughter_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccination_records" ADD CONSTRAINT "vaccination_records_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccination_records" ADD CONSTRAINT "vaccination_records_vaccine_id_vaccines_id_fk" FOREIGN KEY ("vaccine_id") REFERENCES "public"."vaccines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weight_records" ADD CONSTRAINT "weight_records_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;