SELECT eS.Name as SurveyName, eS.Description as SurveyDiscription, eSQ.Question, eSQ.Options, xSUA.Answer
FROM entitySurvey as eS
INNER JOIN entitysurveyquestion as eSQ ON (eS.ID = eSQ.SurveyID) && (eSQ.IsActive = 1)
INNER JOIN xrefsurveyuser as xSU ON (eS.ID = xSU.SurveyID) && (xSU.IsActive = 1)
LEFT JOIN xrefsurveyuseranswer as xSUA ON (xSU.SurveyID = xSUA.SurveyID) && (xSUA.IsActive = 1)
WHERE (xSU.UserID) = 1 && (eS.IsActive = 1)