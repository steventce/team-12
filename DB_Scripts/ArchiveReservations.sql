DELIMITER $$

CREATE
    EVENT `archive_reservations`
    ON SCHEDULE EVERY 1 DAY STARTS '2017-03-29 00:00:00'
    DO BEGIN
        SET @now = UTC_TIMESTAMP();

        --  archive old reservation data
        INSERT INTO reservations_archive (
            reservation_id,
            resource_id,
            staff_id,
            staff_name,
            staff_department,
            staff_email,
            start_date,
            end_date,
            created_at,
            updated_at
        )
        SELECT
            r.reservation_id,
            r.resource_id,
            r.staff_id,
            r.staff_name,
            r.staff_department,
            r.staff_email,
            r.start_date,
            r.end_date,
            r.created_at,
            r.updated_at
        FROM reservations r
        WHERE 1 = 1
        AND r.end_date < @now;

        -- delete the reservations that were just added
        DELETE from reservations
        WHERE 1 = 1
        AND end_date < @now;

    END $$

DELIMITER ;
