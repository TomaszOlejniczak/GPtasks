WITH TeacherLessonDuration AS (
    SELECT
        -- first column Teacher ID
        t.TeacherID,
        -- Teacher name and surname (second column)
        CONCAT(u.Name, ' ', u.Surname) AS TeacherName,
        -- calculation for get exact lessons time
        DATEDIFF(
            MINUTE,
            TRY_CONVERT(TIME, LEFT(ldpt.Hours, CHARINDEX('-', ldpt.Hours) - 1)),
            TRY_CONVERT(TIME, RIGHT(ldpt.Hours, LEN(ldpt.Hours) - CHARINDEX('-', ldpt.Hours)))
        ) / 60.0 AS LessonHours,
        -- proper hourly rate
        COALESCE(
            CASE
                WHEN ct.Kind = 'Current' THEN TRY_CONVERT(DECIMAL(10, 2), ct.Rate)
                ELSE 50.00
            END,
            50.00
        ) AS HourlyRate,
        -- proper currency symbol based on teacher location
        cc.CurrencySymbol
    FROM LessonInfo li
    -- proper tables joiners
    INNER JOIN Timetable tt
        ON li.TimetableID = tt.TimetableID
    INNER JOIN Course cr
        ON tt.CourseID = cr.CourseID
    INNER JOIN LessonDatePerTimetable ldpt
        ON tt.TimetableID = ldpt.LessonDatePerTimetableId
    INNER JOIN Teacher t
        ON tt.TeacherID = t.TeacherID
    INNER JOIN [User] u
        ON t.UserID = u.Id
    LEFT JOIN Contract ct
        ON t.TeacherID = ct.TeacherID
        AND ct.Kind = 'Current'
    INNER JOIN Localisation l
        ON tt.LocalisationID = l.LocalisationID
    INNER JOIN City ci
        ON l.CityID = ci.CityID
    INNER JOIN Voivodeship v
        ON ci.VoivodeshipID = v.VoivodeshipID
    INNER JOIN Country co
        ON v.CountryID = co.CountryID
    INNER JOIN CountryCurrency cc
        ON co.CountryID = cc.CountryID
    -- filters: finished lessons state, course type and up to 90 days before current date
    WHERE li.LessonState = 'finished'
        AND cr.CourseType = 'DemonstrationLesson1On1Online'
        AND ldpt.Date >= DATEADD(DAY, -90, CAST(GETDATE() AS DATE))
)
SELECT
    -- proper amount calculation
    TeacherID,
    TeacherName,
    CONCAT(
        FORMAT(
            SUM(LessonHours * HourlyRate),
            'N2'
        ),
        ' ',
        CurrencySymbol
    ) AS AmountToBePaid
FROM TeacherLessonDuration
GROUP BY
    TeacherID,
    TeacherName,
    CurrencySymbol
ORDER BY
    TeacherID