![Ануар Аймолдин на ODS Дата Елке](https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles//anuar_ods.jpg)

Зовут меня Ануар, в прошлом году я закончил ШАД и моё свободное время потихоньку начало перемещаться от нытья на учёбу в кругу друзей на аккуратную валидацию сразу на лидерборд и обсуждение слухов про прайвэт шэринг.

За последний год я затащил пневматоракс, взял 5 серебряных медалек и побывал на 14 месте в общем соревновательном рейтинге.

Коротко как это было...

## Quick, Draw! Doodle Recognition Challenge
*49 / 1314, серебро*

Решали мы с @m1ckyro5a, особо не шарили, ведь это был наш первый картиночный конкурс, в который мы просто залетели поорудовать своими клешнями.

На протяжении всего конкурса старательно готовили модельки для стакинга, а потом выяснилось что у наших с ним жупитер жопаскриптов были разные фолды.

Закончили в серебре, слыхом не слыхивали про балансировку классов, которая была ключом к победе на соревке.

## Microsoft Malware Prediction
*55 / 2426, серебро*

Соревка на таблички, в которую я зашел после значительного перерыва. Был в завязке, так как на меня п��действовала казахстанская социальная реклама против кагела (так уж повелось, что это занятие усилиями одного товарища весьма социально непрестижное).

Тем не менее пропаганду я преодолел и взялся за оверфит.

План был простой - вообще не думать и приготовить большой стакинг из разных моделек и препроцессингов.

Личный интерес был попробовать как работают нейроночки на табличных ��анных, даже порывался написать хороший пайплайн на экспорт со звучным названием TabularAI. Нейронка на удивление зашла и стала лучшей соло моделью.

В какой-то момент я не удержался и начал думать: удалять оверфит признаки, распределение которых на трейне и тесте решительно разнится. Наудалялся, получил хуже и на валидации, и на паблик лидерборде. Решил, что лучше не думать. 

Уже потом после оглашения финальных результатов выяснилось, что эта модель была уже на одном фолде на порядок сильнее лучшего нейроннодеревянного ансамбля и попадала в голд.

Было так больно, что в таблички я больше не играл.

## Freesound Audio Tagging 2019
*21 / 880, серебро*

Началось всё с того, что на работку к нам вышел один очень крутой математик @bayev_alen, который до сего момента слыхом не слыхивал про этот ваш дип мышин лёнинг. За пару дней устроив ему небольшой ликбез про корабли, бороздящие просторы, оставили его одного писать пайплайн для этого конкурса, чтоб подучился так сказать. Через неделю пайплайн был готов, и тут выходят настоящие профессионалы: я и @m1ckyro5a, менять циферки в готовых конфигах...

Соревнование в итоге оказалось безумно сложным: большой простор при выборе моделек, препроцессинга и постпроцессинга.

До золота не дотерпели, зато @bayev_alen очень быстро вкатился в нейроночки и в звучки.

Главная цитата конкурса: железа хватает - мозгов не хватает.

## iMaterialist (Fashion) 2019 at FGVC6
*24 / 241, серебро*

Вписался в команду с 5 головорезами с работы позапускать MMDetection из коробки. Запустили, работает, тема.

## SIIM-ACR Pneumothorax Segmentation
*1 / 1475, золото*

Медицинское соревнование на сегментацию для обнаружения пневматоракса на рентгеновском снимке.

- В конкурс заходил, чтобы узнать как работают юнеты. В итоге сделал всяких разных импортов и как работают юнеты я так и не узнал.
- Первая лучшая соло модель была получена, когда я перепутал знак в ReduceLROnPlateau. В итоге получилась весьма занятная стратегия: не вмешиваться, когда модель становится хуже и пытаться приостановить обучение, когда моделька умудряется улучшаться 3 эпохи подряд. И этой стратегии я придерживался около 2 недель. Видать на выходе получались модели, которые видели энное число :shit: и спокойно справлялись с процессом обучения. Как водится такого рода баги стоит признавать ��а регуляризацию и пытаться жить дальше.
- О том, какие аугментации я делал я даже не догадывался и посмотрел только, когда делал презентацию для организаторов. Как выяснилось они были страшно агрессивными и никто в здравом уме не стал бы их использовать. Но тем не менее, зашло.
- Также было приятно, что идея постпроцессинга с этого решения в дальнейшем была использована @kydna в Understanding Clouds from Satellite Images, чтобы взять соло голд и заслуженное звание грандмастера.

**Пайплайн**: [github.com/sneddy/pneumothorax-segmentation](https://github.com/sneddy/pneumothorax-segmentation)  
**Видосик**: [youtu.be/Wuf0wE3Mrxg](https://youtu.be/Wuf0wE3Mrxg)

## RSNA Intracranial Hemorrhage Detection
*33 / 1345, серебро*

Еще одно медицинское соревнование с огромным числом картинок и интересными метаданными, которые со временем превратили весёлый картиночный конкурс в унылую табличную классификацию со стакингами n-го уровня.

Вписался в него за компанию с @userseri и @nurmau и одним весёлым жизнерадостным японцем.

Конкурс запомнился мне тем, что любая идея, любой придуманный костыль оказывались слабее соответствующего публичного пайплайна.

За 3 часа до конца на��ел багу в валидации, исправил. И хорошо, что не лёг спать: решение с багой было бы месте на 20м, а без баги - на 30м.

Ненавижу.
