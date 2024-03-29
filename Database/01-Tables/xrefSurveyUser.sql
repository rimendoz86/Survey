DROP TABLE IF EXISTS xrefSurveyUser;
CREATE TABLE xrefSurveyUser ( 
    ID INT NOT NULL AUTO_INCREMENT,
    SurveyID INT NOT NULL,
    UserID INT NOT NULL,
    IsComplete bit(1) DEFAULT b'0',
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsActive bit(1) NOT NULL DEFAULT b'1',
    PRIMARY KEY (ID)
    );

INSERT INTO xrefSurveyUser 
(SurveyID, UserID)
VALUES
(1,1);