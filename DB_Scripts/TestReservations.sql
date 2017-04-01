use resource_booker;

INSERT INTO reservations
    (reservation_id, Resource_Id,Staff_Id,Staff_Name,Staff_Department,Staff_Email,Start_Date,End_Date,created_at,updated_at)
VALUES
    ('1', '1', '123', 'john smith', 'dev', 'johnsmith@hsbc.com', '2017-02-20 23:59:59', '2017-02-24 23:59:59', '2017-02-20 23:59:59', '2017-02-22 23:59:59');
    
INSERT INTO reservations
    (reservation_id, Resource_Id,Staff_Id,Staff_Name,Staff_Department,Staff_Email,Start_Date,End_Date,created_at,updated_at)
VALUES
    ('2', '3', '123', 'john smith', 'dev', 'johnsmith@hsbc.com', '2017-02-22 23:59:59', '2017-02-24 23:59:59', '2017-02-22 23:59:59', '2017-02-24 23:59:59');
    
INSERT INTO reservations
    (reservation_id, Resource_Id,Staff_Id,Staff_Name,Staff_Department,Staff_Email,Start_Date,End_Date,created_at,updated_at)
VALUES
    ('3', '3', '456', 'jane smith', 'marketing', 'janesmith@hsbc.com', '2017-02-22 23:59:59', '2017-02-24 23:59:59', '2017-02-22 23:59:59', '2017-02-24 23:59:59');