DROP TABLE IF EXISTS entitySurveyQuestion;
CREATE TABLE entitySurveyQuestion ( 
    ID INT NOT NULL AUTO_INCREMENT,
    SurveyID INT NOT NULL,
    QuestionOrder INT NOT NULL,
    Question VARCHAR(50) NOT NULL,
    Options VARCHAR (500) NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsActive bit(1) NOT NULL DEFAULT b'1',
    PRIMARY KEY (ID)
    );

INSERT INTO entitySurveyQuestion 
(ID,SurveyID , Question)
VALUES
(1,1, "Enter Your Name");