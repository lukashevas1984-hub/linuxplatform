/* New lessons reconstructed from the recovery specification; independently authored prose. */
const CHEATSHEET_REVIEW = {revision:"e3869d923be9843715aaf74a9228f045906d351f",url:"https://github.com/faster-droid/Linux-cheatsheet/blob/e3869d923be9843715aaf74a9228f045906d351f/README.md"};
const EXTRA_LESSONS = [
 {
  "id": "foundation-lookup",
  "moduleId": "foundation",
  "slug": "lookup",
  "title": "Как оболочка находит команду",
  "why": "Различать встроенную команду и файл программы.",
  "paragraphs": [
   "Shell сначала разбирает команду и ищет её реализацию. Builtin — встроенная команда самой оболочки; cd меняет рабочий каталог именно этой оболочки. Отдельная дочерняя программа не может изменить cwd родителя.",
   "Для внешнего имени shell использует PATH — упорядоченный список каталогов окружения. Окружение наследуется дочерним процессом, но не является общим изменяемым словарём для всех процессов. В настоящем shell на поиск также влияют функции, aliases и кеш.",
   "type помогает понять, что за именем; command -v показывает найденную реализацию. В тренажёре используется фиксированный учебный набор, а не настоящий PATH компьютера. Проверять неизвестную команду безопаснее, чем запускать найденный в Интернете бинарник."
  ],
  "example": "type cd\ncommand -v curl",
  "interpretation": "cd is a shell builtin; curl найден по /usr/bin/curl в учебной модели.",
  "parts": [
   {
    "token": "type cd",
    "meaning": "cd is a shell builtin; curl найден по /usr/bin/curl в учебной модели."
   }
  ],
  "question": "Почему cd встроена в оболочку?",
  "options": [
   "Она всегда требует root",
   "Она меняет рабочий каталог самой оболочки",
   "Она ищет ядро по PATH"
  ],
  "answer": 1,
  "explanation": "Она меняет рабочий каталог самой оболочки. type помогает понять, что за именем; command -v показывает найденную реализацию. В тренажёре используется фиксированный учебный набор, а не настоящий PATH компьютера. Проверять неизвестную команду безопаснее, чем запускать найденный в Интернете бинарник.",
  "sourceSection": "Linux-cheatsheet → Shell commands, Environment variables, PATH"
 },
 {
  "id": "foundation-patterns",
  "moduleId": "foundation",
  "slug": "patterns",
  "title": "Имена файлов, строки и кавычки",
  "why": "Не путать glob оболочки с регулярным выражением grep.",
  "paragraphs": [
   "Glob сопоставляет имена путей: *.log означает имена с указанным окончанием. Регулярное выражение описывает строки: ^ привязывает начало, а (WARN|ERROR) в расширенном синтаксисе выбирает одну из двух ветвей.",
   "Кавычки определяют, что получит программа. В find /var/log -name \"*.log\" шаблон должен дойти до find, а не превратиться заранее в список файлов текущего каталога. Одинарные кавычки сохраняют текст буквально; двойные в настоящем shell допускают некоторые подстановки.",
   "grep -E использует расширенные выражения, grep -F ищет буквальную строку. Для пользовательского текста с точками и скобками -F часто точнее. Симулятор поддерживает показанное подмножество и не воспроизводит все правила POSIX regex и shell glob."
  ],
  "example": "find /var/log -name \"*.log\"\ngrep -E \"^(WARN|ERROR)\" /home/student/samples/states.txt",
  "interpretation": "find отбирает имена; grep отбирает строки WARN и ERROR в заданном файле.",
  "parts": [
   {
    "token": "find /var/log -name \"*.log\"",
    "meaning": "find отбирает имена; grep отбирает строки WARN и ERROR в заданном файле."
   }
  ],
  "question": "Как искать буквально строку a.b?",
  "options": [
   "grep \"a.b\" всегда буквально",
   "find -name ищет содержимое строк",
   "grep -F \"a.b\" файл"
  ],
  "answer": 2,
  "explanation": "grep -F \"a.b\" файл. grep -E использует расширенные выражения, grep -F ищет буквальную строку. Для пользовательского текста с точками и скобками -F часто точнее. Симулятор поддерживает показанное подмножество и не воспроизводит все правила POSIX regex и shell glob.",
  "sourceSection": "Linux-cheatsheet → Wildcards, Quoting, grep"
 },
 {
  "id": "permissions-creation",
  "moduleId": "permissions",
  "slug": "creation",
  "title": "Права при создании и общие каталоги",
  "why": "Предсказывать доступ нового файла и не путать его с удалением имени.",
  "paragraphs": [
   "Программа запрашивает исходные mode-биты, ядро применяет umask как маску: requested & ~umask. Это не обычное арифметическое вычитание. Для типичного файла 0666 и маски 0027 получается 0640, для каталога 0777 — 0750.",
   "Default ACL родителя меняет расчёт прав при создании; проверь getfacl, а не только umask. SGID каталога помогает наследовать группу, но сам по себе не выдаёт ей запись. Sticky ограничивает удаление и переименование с учётом владельца файла, каталога и привилегий.",
   "Для удаления имени нужны write и search/execute на родительском каталоге, проход по пути и отсутствие дополнительных запретов. chmod 444 файла не гарантирует невозможность удаления имени. Биты файла отвечают за его содержимое и выполнение, а записи имён принадлежат каталогу."
  ],
  "example": "0666 & ~0027 = 0640\n0777 & ~0027 = 0750",
  "interpretation": "Это расчёт маски, а не команда для ввода в учебный shell.",
  "parts": [
   {
    "token": "0666 & ~0027 = 0640",
    "meaning": "Это расчёт маски, а не команда для ввода в учебный shell."
   }
  ],
  "question": "Что гарантирует SGID каталога?",
  "options": [
   "Всегда включает group write",
   "Помогает наследовать группу, но не гарантирует запись",
   "Запрещает удаление владельцу каталога"
  ],
  "answer": 1,
  "explanation": "Помогает наследовать группу, но не гарантирует запись. Для удаления имени нужны write и search/execute на родительском каталоге, проход по пути и отсутствие дополнительных запретов. chmod 444 файла не гарантирует невозможность удаления имени. Биты файла отвечают за его содержимое и выполнение, а записи имён принадлежат каталогу.",
  "sourceSection": "Linux-cheatsheet → Permissions, umask, Special permissions"
 },
 {
  "id": "processes-inspection",
  "moduleId": "processes",
  "slug": "inspection",
  "title": "Процесс изнутри: /proc и PSI",
  "why": "Соотносить метрику с объектом и единицами.",
  "paragraphs": [
   "/proc/PID/status описывает выбранный процесс. VmRSS выражен в kB и оценивает резидентную память; это не вся виртуальная память и не объём cgroup. /proc/PID/limits показывает ограничения конкретного процесса, а не только системный максимум.",
   "PSI — pressure stall information: доля времени ожидания ресурса. some означает, что ждала хотя бы одна задача, full — одновременную остановку всех небездействующих задач в соответствующей области. avg10/60/300 — усреднённые проценты, total — накопленное время в микросекундах.",
   "Один снимок не устанавливает причину ожидания. Сопоставляй рост pressure с задержками устройства и состояниями процессов. strace и eBPF требуют доступа, имеют стоимость и способны раскрыть чувствительные данные; применяй ограниченно по гипотезе."
  ],
  "example": "cat /proc/1240/status\ncat /proc/1240/limits\ncat /proc/pressure/io",
  "interpretation": "VmRSS 65536 kB относится к PID 1240, PSI I/O относится к области наблюдения, а total накоплен.",
  "parts": [
   {
    "token": "cat /proc/1240/status",
    "meaning": "VmRSS 65536 kB относится к PID 1240, PSI I/O относится к области наблюдения, а total накоплен."
   }
  ],
  "question": "Можно ли по одному avg10 установить неисправный диск?",
  "options": [
   "Нет, нужны связанные измерения и контекст",
   "Да, любой PSI означает поломку",
   "Да, total содержит время последней ошибки"
  ],
  "answer": 0,
  "explanation": "Нет, нужны связанные измерения и контекст. Один снимок не устанавливает причину ожидания. Сопоставляй рост pressure с задержками устройства и состояниями процессов. strace и eBPF требуют доступа, имеют стоимость и способны раскрыть чувствительные данные; применяй ограниченно по гипотезе.",
  "sourceSection": "Linux-cheatsheet → Processes, /proc, Resource monitoring"
 },
 {
  "id": "storage-links",
  "moduleId": "storage",
  "slug": "links",
  "title": "Имя, inode и открытый файл",
  "why": "Разберём, почему удаление имени не всегда освобождает занятое место.",
  "paragraphs": [
   "Имя в каталоге ссылается на inode. Два hard link — два имени одного inode в пределах одной файловой системы. Копия — отдельный файл с собственными данными и inode; последующая правка оригинала не обязана менять копию.",
   "Symlink хранит путь, который разрешается при обращении. Он может пересекать файловые системы и стать битым после удаления цели. Удаление одного жёсткого имени не удаляет остальные и не переписывает путь в symlink.",
   "Когда жёстких имён уже нет, открытый файловый дескриптор может удерживать inode и данные. В упрощённой модели ниже освобождение возможно после закрытия последнего дескриптора. В реальной системе проверь lsof +L1 и штатный способ переоткрытия файла процессом."
  ],
  "example": "report.txt → inode 42 ← report.alias\nshortcut → путь report.txt\nдескриптор → inode 42",
  "interpretation": "Удаление report.txt ломает shortcut, но report.alias продолжает давать доступ.",
  "parts": [
   {
    "token": "report.txt → inode 42 ← report.alias",
    "meaning": "Удаление report.txt ломает shortcut, но report.alias продолжает давать доступ."
   }
  ],
  "question": "После удаления обоих имён открытый дескриптор…",
  "options": [
   "Всегда немедленно закрывается",
   "Превращается в symlink",
   "Может удерживать файл и занятое место"
  ],
  "answer": 2,
  "explanation": "Может удерживать файл и занятое место. Когда жёстких имён уже нет, открытый файловый дескриптор может удерживать inode и данные. В упрощённой модели ниже освобождение возможно после закрытия последнего дескриптора. В реальной системе проверь lsof +L1 и штатный способ переоткрытия файла процессом.",
  "sourceSection": "Linux-cheatsheet → Filesystem, Hard links and symbolic links"
 },
 {
  "id": "storage-redundancy",
  "moduleId": "storage",
  "slug": "redundancy",
  "title": "RAID, snapshot и backup",
  "why": "Выбирать защиту под конкретный отказ.",
  "paragraphs": [
   "RAID объединяет устройства для доступности или производительности. Он не защищает от удаления пользователем, шифровальщика или ошибки приложения. При RAID 10 результат двух отказов зависит от того, затронуты ли оба устройства одной зеркальной пары.",
   "Snapshot фиксирует состояние на момент в рамках возможностей хранилища. Локальный snapshot может зависеть от того же массива и административного домена. Без согласования с приложением снимок активной базы не обязательно согласован на её уровне.",
   "Независимый backup должен пережить выбранный сценарий потери: учитывай отдельное хранение, доступ, неизменяемость и restore drill. RPO и RTO определяют, сколько данных и времени можно потерять. Проверяй восстановление, а не только статус задания копирования."
  ],
  "example": "Отказ диска → RAID\nОшибка изменения → snapshot\nПотеря массива → независимая копия",
  "interpretation": "Это примеры границ, а не обещание защиты от любого отказа.",
  "parts": [
   {
    "token": "Отказ диска → RAID",
    "meaning": "Это примеры границ, а не обещание защиты от любого отказа."
   }
  ],
  "question": "Заменяет ли RAID резервную копию?",
  "options": [
   "Да, если массив зелёный",
   "Нет, отказ диска — лишь один из сценариев",
   "Да, RAID 10 переживает любые два отказа"
  ],
  "answer": 1,
  "explanation": "Нет, отказ диска — лишь один из сценариев. Независимый backup должен пережить выбранный сценарий потери: учитывай отдельное хранение, доступ, неизменяемость и restore drill. RPO и RTO определяют, сколько данных и времени можно потерять. Проверяй восстановление, а не только статус задания копирования.",
  "sourceSection": "Linux-cheatsheet → RAID, Backups, Snapshots"
 },
 {
  "id": "systemd-overrides",
  "moduleId": "systemd",
  "slug": "overrides",
  "title": "Drop-in и эффективный unit",
  "why": "Менять локальную политику без правки пакетного файла.",
  "paragraphs": [
   "Поставляемый пакетом unit может обновиться. Локальные overrides размещают в каталоге unit.d через systemctl edit. systemctl cat помогает увидеть исходные файлы и drop-in, а systemctl show — вычисленные свойства менеджера.",
   "Для замены списка ExecStart обычно требуется сначала пустое ExecStart=, затем новая команда. После изменения нужен daemon-reload, а для применения к процессу — поддерживаемое действие запуска или перезапуска. Это два разных этапа.",
   "Проверь User, WorkingDirectory, EnvironmentFile, LimitNOFILE и ограничения доступа. Подходящие права файла не гарантируют доступ внутри sandbox службы. После изменения unit проверь эффективные свойства, журнал и конечный запрос."
  ],
  "example": "[Service]\nExecStart=\nExecStart=/usr/local/bin/api\nLimitNOFILE=4096",
  "interpretation": "Это пример drop-in для чтения. Пустая строка сбрасывает список команд перед заменой.",
  "parts": [
   {
    "token": "[Service]",
    "meaning": "Это пример drop-in для чтения. Пустая строка сбрасывает список команд перед заменой."
   }
  ],
  "question": "Что проверять после drop-in?",
  "options": [
   "Только сохранение файла",
   "Только наличие каталога unit.d",
   "Эффективные свойства, перезапуск и функцию"
  ],
  "answer": 2,
  "explanation": "Эффективные свойства, перезапуск и функцию. Проверь User, WorkingDirectory, EnvironmentFile, LimitNOFILE и ограничения доступа. Подходящие права файла не гарантируют доступ внутри sandbox службы. После изменения unit проверь эффективные свойства, журнал и конечный запрос.",
  "sourceSection": "Linux-cheatsheet → systemd, Service management"
 },
 {
  "id": "network-tls",
  "moduleId": "network",
  "slug": "tls",
  "title": "TLS после TCP: имя, SNI и измерения",
  "why": "Локализовать TLS, не отключая проверку сертификата.",
  "paragraphs": [
   "После TCP клиент устанавливает TLS-сессию. Сертификат должен быть доверенным и подходить имени запроса. SNI передаёт имя серверу при handshake, чтобы тот выбрал нужный виртуальный сайт. TCP connect не доказывает исправность TLS или HTTP.",
   "curl --resolve связывает имя и порт с заданным адресом, сохраняя имя URL для SNI и проверки сертификата. Запрос по IP с одним только Host-заголовком не всегда проверяет тот же TLS-путь. При отказе проверяй имя, сроки, цепочку доверия и часы.",
   "time_namelookup, time_connect, time_appconnect и time_starttransfer — накопительные времена от начала операции. Разности могут оценивать этапы при контролируемых условиях, без повторного использования соединения и неожиданных redirect. Не отключай TLS-проверку как исправление."
  ],
  "example": "curl --resolve example.com:443:192.0.2.10 https://example.com/",
  "interpretation": "В настоящем curl имя URL остаётся example.com. TLS здесь объясняется, но не исполняется симулятором.",
  "parts": [
   {
    "token": "curl --resolve example.com:443:192.0.2.10 https://example.com/",
    "meaning": "В настоящем curl имя URL остаётся example.com. TLS здесь объясняется, но не исполняется симулятором."
   }
  ],
  "question": "Что сохраняет --resolve по сравнению с URL по IP?",
  "options": [
   "Имя URL для SNI и проверки сертификата",
   "Автоматическое доверие любому сертификату",
   "Обход TLS и переход на HTTP"
  ],
  "answer": 0,
  "explanation": "Имя URL для SNI и проверки сертификата. time_namelookup, time_connect, time_appconnect и time_starttransfer — накопительные времена от начала операции. Разности могут оценивать этапы при контролируемых условиях, без повторного использования соединения и неожиданных redirect. Не отключай TLS-проверку как исправление.",
  "sourceSection": "Linux-cheatsheet → Networking, curl, TLS"
 },
 {
  "id": "security-privileges",
  "moduleId": "security",
  "slug": "privileges",
  "title": "Root, capabilities и MAC",
  "why": "Различать идентичность и эффективные полномочия.",
  "paragraphs": [
   "UID 0 не означает безусловного доступа во всех контекстах. Capabilities разделяют привилегии на отдельные права; ограничения namespace, mount и SELinux/AppArmor могут продолжать действовать. Проверяй контекст именно того процесса, который получил отказ.",
   "Для низкого порта возможна CAP_NET_BIND_SERVICE, но важен также порог непривилегированных портов в текущем network namespace. Не выдавай полный root только ради одной операции. File capabilities, ambient-набор и политика службы требуют осознанной настройки.",
   "MAC — обязательный контроль доступа поверх обычных владельцев и mode-битов. При неожиданном отказе изучи журнал политики и разрешённые операции; массовое отключение SELinux/AppArmor скрывает причину и расширяет область доступа."
  ],
  "example": "UID / группы → DAC\ncapabilities → отдельные привилегии\nnamespace / mount / MAC → дополнительные границы",
  "interpretation": "Схема объясняет слои проверки; это не список выполненных команд.",
  "parts": [
   {
    "token": "UID / группы → DAC",
    "meaning": "Схема объясняет слои проверки; это не список выполненных команд."
   }
  ],
  "question": "Почему root может получить отказ?",
  "options": [
   "Root никогда не получает отказ",
   "Полномочия ограничены контекстом и политиками",
   "Только из-за неверного пароля sudo"
  ],
  "answer": 1,
  "explanation": "Полномочия ограничены контекстом и политиками. MAC — обязательный контроль доступа поверх обычных владельцев и mode-битов. При неожиданном отказе изучи журнал политики и разрешённые операции; массовое отключение SELinux/AppArmor скрывает причину и расширяет область доступа.",
  "sourceSection": "Linux-cheatsheet → Security, Capabilities, SELinux/AppArmor"
 },
 {
  "id": "delivery-resource-boundary",
  "moduleId": "delivery",
  "slug": "resource-boundary",
  "title": "Namespaces и cgroups: разные границы",
  "why": "Отличать видимость ресурсов от их лимитов.",
  "paragraphs": [
   "Namespaces изолируют видимость объектов: PID, сеть, mount и другие пространства. Cgroups объединяют процессы для учёта и управления ресурсами. Контейнер может видеть мало процессов, но конкурировать за физические ресурсы того же хоста.",
   "В cgroup v2 memory.current показывает текущий учёт памяти в байтах, memory.max — жёсткую границу или max. Учебные значения 125829120 и 134217728 соответствуют 120 MiB и 128 MiB. Это локальная граница группы, а не вся свободная память хоста.",
   "memory.events содержит накопленные счётчики, без собственной даты события. Нули oom и oom_kill не подтверждают OOM; exit 137 означает завершение сигналом 9 в типичном shell-кодировании, но сам по себе не устанавливает источник сигнала. Сопоставляй события, время и состояние процесса."
  ],
  "example": "cat /sys/fs/cgroup/training-api/memory.current\ncat /sys/fs/cgroup/training-api/memory.max\ncat /sys/fs/cgroup/training-api/memory.events",
  "interpretation": "120 MiB использовано при лимите 128 MiB; счётчики OOM в этом стенде равны нулю.",
  "parts": [
   {
    "token": "cat /sys/fs/cgroup/training-api/memory.current",
    "meaning": "120 MiB использовано при лимите 128 MiB; счётчики OOM в этом стенде равны нулю."
   }
  ],
  "question": "Доказывает ли exit 137 OOM?",
  "options": [
   "Да, это отдельный код OOM ядра",
   "Да, если на хосте много свободной памяти",
   "Нет, нужны события и связанный контекст"
  ],
  "answer": 2,
  "explanation": "Нет, нужны события и связанный контекст. memory.events содержит накопленные счётчики, без собственной даты события. Нули oom и oom_kill не подтверждают OOM; exit 137 означает завершение сигналом 9 в типичном shell-кодировании, но сам по себе не устанавливает источник сигнала. Сопоставляй события, время и состояние процесса.",
  "sourceSection": "Linux-cheatsheet → Containers, Namespaces, cgroups"
 },
 {
  "id": "observability-text-pipelines",
  "moduleId": "observability",
  "slug": "text-pipelines",
  "title": "Текстовый конвейер как проверяемая модель",
  "why": "Строить отчёт по реальному формату и сохранять исходник.",
  "paragraphs": [
   "Сначала прочитай несколько строк и установи формат: в учебном requests.log поля — клиент, путь и HTTP-код. awk выбирает поля по пробельному разделению, cut — по заданному разделителю. Это не универсальные CSV-парсеры с кавычками и вложенными разделителями.",
   "uniq объединяет только соседние одинаковые строки. Поэтому перед подсчётом по ключу нужен sort; затем sort -nr упорядочивает количества численно по убыванию. Номер поля зависит от формата журнала. Пять записей без временного окна не задают скорость запросов.",
   "sed может подготовить преобразованный поток, tee сохранить его и передать дальше, diff сравнить два файла. Пиши кандидата отдельно: diff 0 означает совпадение, 1 — различие, 2 — ошибку. Различие не доказывает применение конфига к службе."
  ],
  "example": "awk '{print $3}' /var/log/requests.log | sort | uniq -c | sort -nr",
  "interpretation": "В выборке два 200, один 500 и два 503; три ответа 5xx не устанавливают причину.",
  "parts": [
   {
    "token": "awk '{print $3}' /var/log/requests.log | sort | uniq -c | sort -nr",
    "meaning": "В выборке два 200, один 500 и два 503; три ответа 5xx не устанавливают причину."
   }
  ],
  "question": "Почему sort ставят перед uniq -c?",
  "options": [
   "sort нужен только для порядка вывода и не влияет на корректность подсчёта uniq",
   "uniq считает только соседние одинаковые строки",
   "uniq всегда группирует все строки по всему файлу"
  ],
  "answer": 1,
  "explanation": "uniq считает только соседние одинаковые строки. sed может подготовить преобразованный поток, tee сохранить его и передать дальше, diff сравнить два файла. Пиши кандидата отдельно: diff 0 означает совпадение, 1 — различие, 2 — ошибку. Различие не доказывает применение конфига к службе.",
  "sourceSection": "Linux-cheatsheet → Text processing, awk, sort, uniq, sed, diff"
 },
 {
  "id": "automation-robustness",
  "moduleId": "automation",
  "slug": "robustness",
  "title": "Надёжные границы Bash",
  "why": "Сохранять имена файлов, ошибки и секреты.",
  "paragraphs": [
   "Кавычки вокруг \"$path\" сохраняют одно имя с пробелами. Для массового обхода произвольных имён предпочтительны NUL-разделители: find -print0 и совместимый потребитель. Перевод строки может быть частью имени, поэтому построчная обработка не универсальна.",
   "trap EXIT помогает убирать временные файлы при обычном завершении shell, но не срабатывает после SIGKILL или потери питания. set -e имеет контекстные исключения и не заменяет проверки каждого критического действия. Синтаксис проверяй bash -n, поведение — тестом отказа.",
   "bash -x способен раскрыть секреты в журнале. Не помещай их в примеры и аргументы без необходимости. Временный файл создавай с подходящими правами, а публикацию результата делай только после проверки успешности всех шагов."
  ],
  "example": "tmp=$(mktemp)\ntrap 'rm -f -- \"$tmp\"' EXIT\n# проверить команды, затем публиковать результат",
  "interpretation": "Это пример настоящего Bash для чтения; подстановки и trap не исполняются учебным shell.",
  "parts": [
   {
    "token": "tmp=$(mktemp)",
    "meaning": "Это пример настоящего Bash для чтения; подстановки и trap не исполняются учебным shell."
   }
  ],
  "question": "Что нельзя обещать от trap EXIT?",
  "options": [
   "Очистку при обычном выходе shell",
   "Возможность удалить временный файл при штатном завершении",
   "Очистку после SIGKILL или потери питания"
  ],
  "answer": 2,
  "explanation": "Очистку после SIGKILL или потери питания. bash -x способен раскрыть секреты в журнале. Не помещай их в примеры и аргументы без необходимости. Временный файл создавай с подходящими правами, а публикацию результата делай только после проверки успешности всех шагов.",
  "sourceSection": "Linux-cheatsheet → Bash scripting, Quoting, Error handling"
 },
 {
  "id": "recovery-transfer",
  "moduleId": "recovery",
  "slug": "transfer",
  "title": "rsync: путь, метаданные и согласованность",
  "why": "Планировать копирование и проверять восстановление.",
  "paragraphs": [
   "В rsync source/ означает содержимое каталога, а source обычно переносит и сам каталог при соответствующем назначении. Сначала проверь dry-run и список изменений, особенно при --delete: удаление на назначении может быть частью синхронизации.",
   "-a включает типичный архивный набор, но не любые ACL, extended attributes и hard links: для них могут потребоваться -A, -X и -H, права и поддержка обеих ФС. Перед копированием проверь владельцев, пространство, версии и модель доступа.",
   "Dry-run не обеспечивает согласованность активной БД. Используй поддерживаемый backup/snapshot или остановку записей с учётом требований приложения. После копирования проверь данные, метаданные и реальное восстановление функции."
  ],
  "example": "rsync -an source/ destination/",
  "interpretation": "В настоящем rsync -n показывает план копирования содержимого. Команда не исполняется симулятором.",
  "parts": [
   {
    "token": "rsync -an source/ destination/",
    "meaning": "В настоящем rsync -n показывает план копирования содержимого. Команда не исполняется симулятором."
   }
  ],
  "question": "Гарантирует ли rsync -an согласованную копию активной БД?",
  "options": [
   "Нет, согласованность требует механизма приложения",
   "Да, -a блокирует записи БД",
   "Да, dry-run проверяет транзакции"
  ],
  "answer": 0,
  "explanation": "Нет, согласованность требует механизма приложения. Dry-run не обеспечивает согласованность активной БД. Используй поддерживаемый backup/snapshot или остановку записей с учётом требований приложения. После копирования проверь данные, метаданные и реальное восстановление функции.",
  "sourceSection": "Linux-cheatsheet → File transfer, rsync, Backups"
 }
];
Object.assign(INTRO_DRILLS,{
 "foundation-lookup": [
  {
   "command": "type cd",
   "contains": "builtin",
   "explanation": "cd встроена в shell."
  },
  {
   "command": "command -v curl",
   "contains": "/usr/bin/curl",
   "explanation": "Это путь учебной модели."
  }
 ],
 "foundation-patterns": [
  {
   "command": "find /var/log -name \"*.log\"",
   "contains": "app.log",
   "explanation": "Ищем имена файлов, не строки."
  },
  {
   "command": "grep -E \"^(WARN|ERROR)\" /home/student/samples/states.txt",
   "contains": "ERROR config missing",
   "explanation": "Выбраны две строки по расширенному выражению."
  }
 ],
 "processes-inspection": [
  {
   "command": "cat /proc/1240/status",
   "contains": "65536",
   "explanation": "Память конкретного PID в kB."
  },
  {
   "command": "cat /proc/1240/limits",
   "contains": "1024",
   "explanation": "Лимит конкретного процесса."
  },
  {
   "command": "cat /proc/pressure/io",
   "contains": "avg10=12.50",
   "explanation": "Проценты ожидания и накопленные микросекунды."
  }
 ],
 "delivery-resource-boundary": [
  {
   "command": "cat /sys/fs/cgroup/training-api/memory.current",
   "contains": "125829120",
   "explanation": "120 MiB учтено в группе."
  },
  {
   "command": "cat /sys/fs/cgroup/training-api/memory.max",
   "contains": "134217728",
   "explanation": "128 MiB — лимит группы."
  },
  {
   "command": "cat /sys/fs/cgroup/training-api/memory.events",
   "contains": "oom_kill 0",
   "explanation": "Накопленный счётчик, без даты события."
  }
 ],
 "observability-text-pipelines": [
  {
   "command": "cat /var/log/requests.log",
   "contains": "/orders 503",
   "explanation": "Клиент, путь, код: формат нужно прочитать."
  },
  {
   "command": "awk '{print $1}' /var/log/requests.log",
   "contains": "10.0.0.31",
   "explanation": "Выделяем первое поле."
  },
  {
   "command": "awk '{print $1}' /var/log/requests.log | sort | uniq -c | sort -nr",
   "contains": "10.0.0.32",
   "explanation": "sort группирует перед uniq."
  },
  {
   "command": "awk '$3 >= 500 {print $2}' /var/log/requests.log | sort | uniq -c",
   "contains": "/orders",
   "explanation": "Три 5xx относятся к /orders, но причина ещё неизвестна."
  },
  {
   "command": "sed 's/^debug=true$/debug=false/' /etc/training-app.conf > /tmp/training-app.conf",
   "contains": "",
   "explanation": "Кандидат создан отдельно.",
   "file": "/tmp/training-app.conf",
   "content": "port=8080\ndebug=false\nworkers=4\n"
  },
  {
   "command": "diff -u /etc/training-app.conf /tmp/training-app.conf",
   "contains": "+debug=false",
   "explanation": "exit 1 — ожидаемые различия, не ошибка сравнения.",
   "code": 1
  }
 ]
});
const additionalLabs = [
 {
  "id": "http-summary",
  "title": "Сводка HTTP без изменения журнала",
  "level": "Middle",
  "minutes": 15,
  "type": "terminal",
  "scenario": "Команда просит краткую сводку кодов по небольшой выборке. Формат ещё нужно установить; время запросов в ней не указано.",
  "goal": "Сохрани количества кодов в /tmp/http-statuses.txt, прочитай отчёт и сохрани исходник.",
  "checks": [
   "Прочитать формат исходного журнала",
   "Сохранить точные количества 200 → 2, 500 → 1, 503 → 2",
   "Прочитать отчёт и не изменить журнал"
  ],
  "hint": [
   "Начни с cat /var/log/requests.log.",
   "Код — третье пробельное поле; uniq считает соседние строки.",
   "awk, sort, uniq -c, sort -nr; направь вывод в отдельный файл и прочитай его."
  ],
  "solution": [
   "cat /var/log/requests.log",
   "awk '{print $3}' /var/log/requests.log | sort | uniq -c | sort -nr > /tmp/http-statuses.txt",
   "cat /tmp/http-statuses.txt"
  ],
  "question": "Что можно заключить из отчёта?",
  "options": [
   "В выборке три 5xx; причина и скорость без временного окна неизвестны",
   "Клиенты намеренно атакуют сервер",
   "Ошибка обязательно в DNS"
  ],
  "answer": 0,
  "why": "Сводка описывает наблюдения. Причина требует связанных проверок, скорость — времени."
 },
 {
  "id": "config-proposal",
  "title": "Кандидат конфига с проверяемым diff",
  "level": "Middle",
  "minutes": 15,
  "type": "terminal",
  "scenario": "Нужно подготовить отключение debug, сохранив port и workers. Применять конфиг к службе пока не требуется.",
  "goal": "Подготовь /tmp/training-app.conf и сравни его с /etc/training-app.conf, не меняя исходник.",
  "checks": [
   "Прочитать исходный конфиг",
   "Подготовить точный кандидат и сохранить исходник",
   "Сравнить нужные существующие файлы: diff exit 1"
  ],
  "hint": [
   "Прочитай исходник и найди строку debug.",
   "sed без -i выдаёт новый поток; сохрани его в /tmp.",
   "Сравни исходник и кандидата через diff -u. Различия дают код 1, ошибка пути — 2."
  ],
  "solution": [
   "cat /etc/training-app.conf",
   "sed 's/^debug=true$/debug=false/' /etc/training-app.conf > /tmp/training-app.conf",
   "diff -u /etc/training-app.conf /tmp/training-app.conf"
  ],
  "question": "Что означает успешная подготовка?",
  "options": [
   "Служба уже перечитала конфиг",
   "Создан отдельный кандидат; применение и функциональная проверка ещё впереди",
   "diff исправил исходник"
  ],
  "answer": 1,
  "why": "diff читает два файла. Код 1 здесь означает найденное изменение, а не применение настроек."
 }
];
for(const l of additionalLabs){const m=COURSE.find(m=>m.id==='observability');m.labs.push(l);ALL_LABS.push({...l,moduleId:m.id,moduleTitle:m.title,moduleIndex:COURSE.indexOf(m),number:m.labs.length});}
const insertBefore={"foundation-lookup":"applications","foundation-patterns":"applications","permissions-creation":"beyond","storage-links":"space","network-tls":"filtering","delivery-resource-boundary":"diagnosis","observability-text-pipelines":"events","automation-robustness":"scheduling","recovery-transfer":"limits"};
for(const u of EXTRA_LESSONS){let at=TEACHING.findIndex(x=>x.moduleId===u.moduleId&&x.slug===insertBefore[u.id]);if(at<0){at=TEACHING.map(x=>x.moduleId).lastIndexOf(u.moduleId)+1;}TEACHING.splice(at,0,u);UNIT_BY_ID.set(u.id,u);}
const COURSE_SOURCES=[{title:'Сохранившийся LinuxLab.html',note:'41 теоретический блок, симулятор, 26 задач, 12 моделей. PDF не приложен; сверка с ним не выполнена.'},{title:'Linux-cheatsheet',url:CHEATSHEET_REVIEW.url,note:'Источник тем дополнений. Новые объяснения написаны самостоятельно по заданию восстановления.'},{title:'Linux kernel: PSI',url:'https://docs.kernel.org/accounting/psi.html'},{title:'Linux kernel: cgroup v2',url:'https://docs.kernel.org/admin-guide/cgroup-v2.html'},{title:'Linux man-pages: umask',url:'https://man7.org/linux/man-pages/man2/umask.2.html'},{title:'Linux man-pages: capabilities',url:'https://man7.org/linux/man-pages/man7/capabilities.7.html'}];

const SOURCE_SECTIONS={lookup:'§0.8 Как оболочка находит и запускает команду; §19 Bash',patterns:'§0.9 Кавычки, glob и регулярные выражения; §5 Поиск',creation:'§6 Права доступа; Специальные биты',inspection:'§8 Процессы и сигналы; §29 Производительность и трассировка',links:'§0.4 Inode, жёсткие и символические ссылки',redundancy:'§27 Диски: LVM и программный RAID; §38 Сценарий 3 Бэкап',overrides:'§15 Systemd и службы',tls:'§28 Продвинутая сеть → HTTP, TLS и DNS изнутри',privileges:'§31 Ядро → Capabilities; §32 Безопасность и hardening','resource-boundary':'§31 Ядро → cgroups v2; §33 Контейнеры изнутри','text-pipelines':'§17 Обработка текста; §18 Перенаправление и пайпы',robustness:'§19 Bash; §26 Массивы и trap',transfer:'§12 SSH, SCP, rsync; §38 Сценарий 6 Переезд данных'};
for(const u of EXTRA_LESSONS)u.sourceSection='Linux-cheatsheet → '+SOURCE_SECTIONS[u.slug];
