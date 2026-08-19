CREATE TABLE `conversion_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_name` text NOT NULL,
	`session_id` text NOT NULL,
	`cta_id` text,
	`cta_location` text,
	`variant_id` text DEFAULT 'control_v000' NOT NULL,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lead_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`specialty` text NOT NULL,
	`city` text NOT NULL,
	`contact` text NOT NULL,
	`concern` text NOT NULL,
	`plan_interest` text DEFAULT 'Por definir' NOT NULL,
	`consent` integer NOT NULL,
	`attribution_json` text DEFAULT '{}' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
