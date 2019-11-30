DROP TABLE IF EXISTS entityUser;
CREATE TABLE entityUser ( 
    UserID INT NOT NULL AUTO_INCREMENT,
    Login VARCHAR(50) NOT NULL,
    Password VARCHAR(50) NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsAdmin bit(1) NOT NULL DEFAULT b'0',
    IsActive bit(1) NOT NULL DEFAULT b'1',
    PRIMARY KEY (UserID)
    );

INSERT INTO entityUser 
(UserID,Login, Password, IsAdmin)
VALUES
(1, "TestUser", "TestPass",0),
(2, "TestAdmin", "TestPass",1);