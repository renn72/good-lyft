CREATE TABLE `good-lyft_competition` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	`competition_state_id` integer,
	`pretty_id` text,
	`owner_id` integer,
	`name` text,
	`city` text,
	`state` text,
	`country` text,
	`venue` text,
	`federation` text,
	`date` integer,
	`days_of_comp` integer,
	`platforms` integer,
	`rules` text,
	`wc_male` text,
	`wc_female` text,
	`wc_mixed` text,
	`wc_type` text,
	`equipment` text,
	`formula` text,
	`entry_limit` integer,
	`is_started` integer,
	`is_finished` integer,
	`is_fourth` integer,
	`is_paid` integer,
	`is_require_address` integer,
	`is_require_phone` integer,
	`notes` text,
	FOREIGN KEY (`competition_state_id`) REFERENCES `good-lyft_competition_state`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `good-lyft_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `good-lyft_competition_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	`competition_id` integer,
	`day` integer,
	`bracket` integer,
	`round` integer,
	`lift_name` text,
	`current_lifter` integer,
	`next_lifter` integer,
	`state` text
);
--> statement-breakpoint
CREATE TABLE `good-lyft_judge` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	`competition_id` integer,
	`user_id` integer,
	`role` text,
	FOREIGN KEY (`competition_id`) REFERENCES `good-lyft_competition`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `good-lyft_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `good-lyft_division` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`name` text,
	`min_age` integer,
	`max_age` integer,
	`notes` text,
	`competition_id` integer,
	FOREIGN KEY (`competition_id`) REFERENCES `good-lyft_competition`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `good-lyft_entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	`user_id` integer,
	`competition_id` integer,
	`birth_date` integer,
	`gender` text,
	`predicted_weight` integer,
	`entry_weight` integer,
	`wc` text,
	`squat_pb` text,
	`bench_pb` text,
	`deadlift_pb` text,
	`squat_opener` text,
	`bench_opener` text,
	`deadlift_opener` text,
	`squat_rack` text,
	`bench_rack` text,
	`state` text,
	`is_locked` integer,
	`notes` text,
	FOREIGN KEY (`user_id`) REFERENCES `good-lyft_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`competition_id`) REFERENCES `good-lyft_competition`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `good-lyft_entry_to_division` (
	`entry_id` integer,
	`division_id` integer,
	FOREIGN KEY (`entry_id`) REFERENCES `good-lyft_entry`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`division_id`) REFERENCES `good-lyft_division`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `good-lyft_entry_to_event` (
	`entry_id` integer,
	`event_id` integer,
	FOREIGN KEY (`entry_id`) REFERENCES `good-lyft_entry`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`event_id`) REFERENCES `good-lyft_event`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `good-lyft_event` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`name` text,
	`is_squat` integer,
	`is_deadlift` integer,
	`is_bench` integer,
	`notes` text,
	`competition_id` integer,
	FOREIGN KEY (`competition_id`) REFERENCES `good-lyft_competition`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `good-lyft_lift` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`competition_id` integer,
	`entry_id` integer,
	`user_id` integer,
	`lift_name` text,
	`lift_number` integer,
	`weight` text,
	`is_one` integer,
	`is_two` integer,
	`is_three` integer,
	`order` integer,
	`bracket` integer,
	`day` integer,
	`platform` integer,
	`rack_height` text,
	`gender` text,
	`entry_weight` integer,
	`notes` text,
	FOREIGN KEY (`competition_id`) REFERENCES `good-lyft_competition`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entry_id`) REFERENCES `good-lyft_entry`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `good-lyft_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `good-lyft_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`clerk_id` text,
	`birth_date` text,
	`gender` text,
	`address` text,
	`notes` text,
	`instagram` text,
	`open_lifter` text,
	`phone` text,
	`email` text,
	`is_fake` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `competition_state_id_idx` ON `good-lyft_competition` (`competition_state_id`);--> statement-breakpoint
CREATE INDEX `competition_owner_id_idx` ON `good-lyft_competition` (`owner_id`);--> statement-breakpoint
CREATE INDEX `competition_state_competition_id_idx` ON `good-lyft_competition_state` (`competition_id`);--> statement-breakpoint
CREATE INDEX `judge_competition_id_idx` ON `good-lyft_judge` (`competition_id`);--> statement-breakpoint
CREATE INDEX `judge_user_id_idx` ON `good-lyft_judge` (`user_id`);--> statement-breakpoint
CREATE INDEX `division_competition_id_idx` ON `good-lyft_division` (`competition_id`);--> statement-breakpoint
CREATE INDEX `entry_userid_idx` ON `good-lyft_entry` (`user_id`);--> statement-breakpoint
CREATE INDEX `entry_competitionid_idx` ON `good-lyft_entry` (`competition_id`);--> statement-breakpoint
CREATE INDEX `entry_to_division_entryid_idx` ON `good-lyft_entry_to_division` (`entry_id`);--> statement-breakpoint
CREATE INDEX `entry_to_division_divisionid_idx` ON `good-lyft_entry_to_division` (`division_id`);--> statement-breakpoint
CREATE INDEX `entry_to_event_entryid_idx` ON `good-lyft_entry_to_event` (`entry_id`);--> statement-breakpoint
CREATE INDEX `entry_to_event_eventid_idx` ON `good-lyft_entry_to_event` (`event_id`);--> statement-breakpoint
CREATE INDEX `event_competition_id_idx` ON `good-lyft_event` (`competition_id`);--> statement-breakpoint
CREATE INDEX `lift_competitionid_idx` ON `good-lyft_lift` (`competition_id`);--> statement-breakpoint
CREATE INDEX `lift_entryid_idx` ON `good-lyft_lift` (`entry_id`);--> statement-breakpoint
CREATE INDEX `lift_user_id_idx` ON `good-lyft_lift` (`user_id`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `good-lyft_user` (`name`);--> statement-breakpoint
CREATE INDEX `clerk_id_idx` ON `good-lyft_user` (`clerk_id`);