-- 1. Add the year column (run this only once; it will error if the column already exists, which is fine)
ALTER TABLE modules ADD COLUMN year int;

-- 2. Update each lesson with its year
UPDATE modules SET year = 570 WHERE title = 'Muhammad Early Life';
UPDATE modules SET year = 610 WHERE title = 'Beginning of Islam';
UPDATE modules SET year = 615 WHERE title = 'Opposition to Muhammad';
UPDATE modules SET year = 622 WHERE title = 'Migration from Mecca to Medina';
UPDATE modules SET year = 622 WHERE title = 'Constitution of Medina';
UPDATE modules SET year = 624 WHERE title = 'Battles of Badr, Uhud, and the Trench';
UPDATE modules SET year = 628 WHERE title = 'The Treaty of Hudaybiyyah';
UPDATE modules SET year = 630 WHERE title = 'Conquest of Mecca';
UPDATE modules SET year = 632 WHERE title = 'Final Sermon and Muhammad's Death';
UPDATE modules SET year = 632 WHERE title = 'Caliph Abu Bakr and the Ridda Wars';
UPDATE modules SET year = 634 WHERE title = 'Caliph Umar: Expansion and Administration';
UPDATE modules SET year = 644 WHERE title = 'Caliph Uthman and the Compilation of the Quran';
UPDATE modules SET year = 656 WHERE title = 'Caliph Ali and the First Fitna';
UPDATE modules SET year = 680 WHERE title = 'Battle of Karbala and Rise of Shi'a Islam';
UPDATE modules SET year = 661 WHERE title = 'Umayyad Caliphate: Expansion to Spain and Central Asia';
UPDATE modules SET year = 750 WHERE title = 'Abbasid Revolution';
UPDATE modules SET year = 800 WHERE title = 'Baghdad and the Golden Age of Islam';
UPDATE modules SET year = 900 WHERE title = 'Science, Philosophy, and Trade in the Caliphate';
UPDATE modules SET year = 1258 WHERE title = 'Fall of Baghdad and Mongol Invasions';
UPDATE modules SET year = 1299 WHERE title = 'Rise of the Ottomans';
UPDATE modules SET year = 1520 WHERE title = 'Suleiman the Magnificent';
UPDATE modules SET year = 1501 WHERE title = 'The Safavids and Shi'a Revival in Persia';
UPDATE modules SET year = 1556 WHERE title = 'Mughal Empire and Akbar the Great';
UPDATE modules SET year = 700 WHERE title = 'Islamic Art, Architecture, and Scholarship';
UPDATE modules SET year = 1860 WHERE title = 'Colonialism and Decline of Muslim Powers';
UPDATE modules SET year = 1940 WHERE title = 'End of Empire and Rise of Nationalism';
UPDATE modules SET year = 1948 WHERE title = 'Creation of Pakistan and the Arab-Israeli Conflict';
UPDATE modules SET year = 1979 WHERE title = 'Islamic Revolution and Global Islamism';
UPDATE modules SET year = 1990 WHERE title = 'Islam in a Globalized World'; 