CREATE TABLE `good-lyft_role` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	`user_id` integer,
	`name` text,
	FOREIGN KEY (`user_id`) REFERENCES `good-lyft_user`(`id`) ON UPDATE no action ON DELETE cascade
);
