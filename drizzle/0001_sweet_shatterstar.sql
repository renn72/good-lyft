CREATE TABLE `good-lyft_notification` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`competition_id` integer,
	`user_id` integer,
	`title` text,
	`description` text,
	`is_read` integer,
	`is_viewed` integer,
	`is_deleted` integer,
	`notes` text,
	FOREIGN KEY (`competition_id`) REFERENCES `good-lyft_competition`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `good-lyft_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `good-lyft_event` ADD `other_lifts` text;--> statement-breakpoint
CREATE INDEX `notification_competitionid_idx` ON `good-lyft_notification` (`competition_id`);--> statement-breakpoint
CREATE INDEX `notification_user_id_idx` ON `good-lyft_notification` (`user_id`);