SELECT eSQ.SurveyID as SurveyID, eSQ.ID as QuestionID, eSQ.Question, eSQ.Options, xSU.ID as SurveyUserID, xSUA.ID as SurveyUserAnswerID, xSUA.Answer
FROM entitysurveyquestion as eSQ
LEFT JOIN xrefsurveyuseranswer as xSUA ON (eSQ.ID = xSUA.QuestionID) AND xSUA.IsActive
LEFT JOIN xrefsurveyuser as xSU ON (xSU.SurveyID = eSQ.SurveyID)
WHERE eSQ.IsActive AND eSQ.SurveyID = 1 and xSU.ID = 1