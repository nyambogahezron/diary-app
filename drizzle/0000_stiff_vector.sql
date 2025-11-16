CREATE TABLE `coins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`achievement_coins` integer DEFAULT 0 NOT NULL,
	`game_coins` integer DEFAULT 0 NOT NULL,
	`welcome_bonus_given` integer DEFAULT 0 NOT NULL,
	`last_updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`date` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`mood` integer,
	`mood_emoji` text,
	`is_locked` integer DEFAULT false NOT NULL,
	`is_vault` integer DEFAULT false NOT NULL,
	`template_id` text
);
--> statement-breakpoint
CREATE TABLE `entry_tags` (
	`entry_id` text NOT NULL,
	`tag_id` text NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `media_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`entry_id` text NOT NULL,
	`type` text NOT NULL,
	`uri` text NOT NULL,
	`thumbnail_uri` text,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` text PRIMARY KEY NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`time` text NOT NULL,
	`days` text NOT NULL,
	`last_updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`last_updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`games_played` integer DEFAULT 0,
	`games_won` integer DEFAULT 0,
	`highest_score` integer DEFAULT 0,
	`total_score` integer DEFAULT 0,
	`last_updated` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`created_at` text NOT NULL
);
