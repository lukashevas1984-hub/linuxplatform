
/* Stable colour semantics and a local English/Russian learning dictionary. */
const LINUX_TERMS=[
["PATH", "пути поиска", "concept", "Список каталогов поиска внешних команд.", "См. урок и help."],
["builtin", "встроенная команда", "command", "Выполняется самой оболочкой.", "См. урок и help."],
["type", "тип команды", "command", "Показывает найденную реализацию имени.", "См. урок и help."],
["awk", "выбор полей", "command", "Ограниченное извлечение поля и числовой фильтр.", "См. урок и help."],
["sort", "сортировка", "command", "Группирует строки перед uniq.", "См. урок и help."],
["uniq", "соседние группы", "command", "Считает только соседние одинаковые строки.", "См. урок и help."],
["sed", "преобразование потока", "command", "Создаёт изменённый вывод, исходник не меняется без специального режима.", "См. урок и help."],
["diff", "сравнение файлов", "command", "0 совпадают, 1 различия, 2 ошибка.", "См. урок и help."],
["tee", "разветвление потока", "command", "Пишет в файл и передаёт данные дальше.", "См. урок и help."],
["cut", "выбор полей", "command", "Разделитель и номера полей.", "См. урок и help."],
["umask", "маска прав", "warning", "Битовая маска создания, не вычитание.", "См. урок и help."],
["PSI", "ожидание ресурсов", "concept", "Доля времени остановки из-за дефицита ресурса.", "См. урок и help."],
["cgroup", "группа ресурсов", "concept", "Учёт и управление ресурсами группы процессов.", "См. урок и help."],
["snapshot", "снимок", "concept", "Состояние хранилища на момент; не независимый backup.", "См. урок и help."],
["TLS", "защита соединения", "concept", "Проверка доверия и имени после TCP.", "См. урок и help."],
["rsync", "синхронизация", "command", "Копирование и согласованность — разные задачи.", "См. урок и help."],
["drop-in", "локальное дополнение unit", "concept", "Переопределение настроек без правки пакетного файла.", "См. урок и help."],

 ['shell','командная оболочка','concept','Разбирает командную строку и запускает программы. Shell — программа, а не само ядро.','bash'],
 ['kernel','ядро','concept','Управляет процессами, памятью, устройствами и проверкой доступа.','uname -r'],
 ['process','процесс','concept','Выполняющаяся программа с PID, памятью и открытыми файлами.','ps aux'],
 ['service','служба','concept','Долгоживущий процесс, которым обычно управляет менеджер служб.','systemctl status api'],
 ['unit','объект systemd','concept','Описание service, timer, target или другого объекта systemd.','systemctl cat api'],
 ['PID','идентификатор процесса','concept','Номер конкретного процесса. Перед сигналом проверь, тому ли процессу его посылаешь.','ps aux'],
 ['CPU','процессор','concept','Выполняет инструкции. Высокий load не обязательно означает занятый CPU.','top'],
 ['I/O','ввод и вывод','concept','Чтение или запись: например, работа с диском. Процесс может ждать I/O при свободном CPU.','iostat -x 1'],
 ['RAM','оперативная память','concept','Память, которую используют процессы, ядро и cache.','free -h'],
 ['cache','кеш','concept','Повторно используемые данные для ускорения работы. Освобождаемый page cache не равен утечке.','free -h'],
 ['available','доступно для новых задач','concept','В free это оценка памяти для новых приложений без swap, с учётом части освобождаемого cache.','free -h'],
 ['load average','средняя нагрузка','concept','Среднее число runnable-задач и задач в непрерываемом ожидании. Сопоставляй с количеством CPU и I/O.','uptime'],
 ['inode','структура метаданных файла','concept','Хранит сведения о файле. Inode могут закончиться при свободных блоках.','df -i'],
 ['filesystem','файловая система','concept','Организует файлы на устройстве. Её размер и размер LV могут различаться.','df -h'],
 ['PV','физический том LVM','concept','Источник ёмкости для группы VG.','pvs'],
 ['VG','группа томов','concept','Общий пул ёмкости LVM, из которого выделяют место LV.','vgs'],
 ['LV','логический том','concept','Блочное устройство внутри VG. Расширение LV не всегда автоматически расширяет ФС.','lvs'],
 ['DNS','разрешение имён','concept','Позволяет получить IP по имени. Сам DNS тоже использует сеть.','dig api.internal'],
 ['TCP','транспортное соединение','concept','Успех TCP не доказывает, что приложение вернуло полезный HTTP-ответ.','ss -tulpn'],
 ['HTTP','протокол запросов и ответов','concept','Код ответа отражает результат на уровне HTTP, а не просто наличие процесса.','curl http://localhost:8080/health'],
 ['SSH','защищённое удалённое подключение','concept','Клиент проверяет сервер и аутентифицируется; приватный ключ остаётся у клиента.','ssh -v web1'],
 ['firewall','межсетевой экран','concept','Разрешает и запрещает сетевой трафик по правилам.','ufw status verbose'],
 ['backup','резервная копия','concept','Копия, пригодность которой проверяют восстановлением и проверкой данных.','tar -tzf /backup/app.tar.gz'],
 ['restore','восстановление','concept','Возвращение данных и работоспособности из копии.','tar -xzf /backup/app.tar.gz -C /srv/app'],
 ['pipeline','конвейер команд','concept','stdout одной команды становится stdin другой. Код последней команды может скрывать ранний сбой.','set -o pipefail'],
 ['stdout','обычный поток вывода','concept','Данные программы. По умолчанию именно этот поток передаётся через |.','grep ERROR /var/log/app.log | tail -n 2'],
 ['stderr','поток диагностики','warning','Сообщения диагностики идут отдельно от stdout, если потоки явно не перенаправлены.','command 2> errors.log'],
 ['systemctl','управление службами','command','Обращается к systemd: проверить состояние, запустить или применить конфигурацию.','systemctl status api'],
 ['journalctl','чтение системного журнала','command','Показывает события systemd journal; -u ограничивает вывод конкретной службой.','journalctl -u api'],
 ['status','состояние','command','Показать состояние объекта. Вывод нужно читать: сама команда не чинит службу.','systemctl status api'],
 ['start','запустить','command','Запустить остановленную службу. Само по себе не включает автозапуск.','systemctl start api'],
 ['restart','перезапустить','command','Остановить и запустить процесс заново. Не исправляет ошибочную конфигурацию.','systemctl restart api'],
 ['reload','перечитать конфиг приложения','command','Попросить службу применить её настройки без полного перезапуска, если она это поддерживает.','systemctl reload sshd'],
 ['daemon-reload','перечитать unit-файлы','command','Обновляет представление units в systemd; само приложение от этого не перезапускается.','systemctl daemon-reload'],
 ['enable','включить автозапуск','command','Без --now не означает немедленный запуск службы.','systemctl enable --now api'],
 ['ExecStart','команда запуска службы','concept','Директива unit-файла: какой исполняемый файл и с какими аргументами запускать.','systemctl cat api'],
 ['chmod','изменить биты прав','command','Меняет rwx, но не владельца. Не выдавай 777 вместо диагностики.','chmod 640 /srv/app/config.env'],
 ['chown','изменить владельца и группу','command','Меняет, к кому относятся классы owner/group.','chown webapp:webapp /srv/app/config.env'],
 ['owner','владелец','concept','Первый класс rwx. Если UID совпал, права group и other к нему не прибавляются.','ls -l /srv/app/config.env'],
 ['group','группа','concept','Класс доступа по группе, если процесс не владелец.','id webapp'],
 ['other','остальные','concept','Класс доступа для тех, кто не попал в owner или group.','chmod 640 /srv/app/config.env'],
 ['grep','отобрать строки','command','Ищет строки по шаблону. Код 1 означает отсутствие совпадений, а не поломку системы.','grep ERROR /var/log/app.log'],
 ['tail','конец вывода','command','Показывает последние строки файла или входного потока.','tail -n 10 /var/log/app.log'],
 ['head','начало вывода','command','Показывает первые строки. Порядок head/tail и grep в конвейере влияет на результат.','ps aux | head -n 10'],
 ['cat','прочитать файл','command','Выводит содержимое файла в stdout.','cat /etc/resolv.conf'],
 ['ls','список файлов','command','-l даёт подробности, -a включает скрытые имена.','ls -la /var/log'],
 ['pwd','текущий каталог','command','Показывает абсолютный путь каталога, относительно которого shell понимает относительные пути.','pwd'],
 ['find','найти файлы по условиям','command','Ищет в дереве каталогов. Перед удалением сначала посмотри выборку.','find /var/log -name "*.log"'],
 ['kill','отправить сигнал процессу','command','Не всегда означает принудительное уничтожение: SIGTERM просит завершиться, а USR1 у nginx переоткрывает логи.','kill -TERM 1842'],
 ['top','наблюдать процессы','command','Показывает динамику CPU, памяти и состояния процессов. В учебном симуляторе это снимок модели.','top'],
 ['uptime','время работы и нагрузка','command','Показывает длительность работы и load average; это не процент CPU.','uptime'],
 ['lsblk','дерево блочных устройств','command','Помогает связать диски, разделы, LVM и точки монтирования.','lsblk -f'],
 ['mount','подключить файловую систему','command','Связывает существующую ФС с каталогом. Это не форматирование диска.','mount -a'],
 ['tar','работать с архивом','command','Можно сначала просмотреть состав, а затем распаковать в выбранный каталог.','tar -tzf /backup/app.tar.gz'],
 ['LISTEN','порт слушает соединения','success','У процесса есть слушающий сокет. Нужны также правильный адрес, маршрут, правила и функциональный ответ.','ss -tulpn'],
 ['curl','проверить запрос','command','Делает HTTP-запрос. Код завершения curl и HTTP-код — разные статусы.','curl http://localhost:8080/health'],
 ['dig','исследовать DNS','command','Запрашивает DNS и показывает ответ resolver.','dig api.internal'],
 ['ss','исследовать сокеты','command','Показывает адреса, порты и процессы, которые слушают соединения.','ss -tulpn'],
 ['df','место файловой системы','command','-h показывает блоки, -i — inode.','df -h'],
 ['du','размер видимых файлов','command','Считает файлы, доступные через дерево каталогов; поэтому может отличаться от df.','du -sh /var/log/*'],
 ['lsof','открытые файлы процессов','command','Помогает найти удалённый файл, который всё ещё занимает место из-за открытого дескриптора.','lsof +L1'],
 ['lvextend','увеличить логический том','command','Расширяет устройство LV. Для ext4 отдельно нужен resize2fs, если не использовано -r.','lvextend -L +5G /dev/vg_data/lv_app'],
 ['resize2fs','изменить размер ext-файловой системы','command','Расширяет ext4 до доступного размера устройства. Для XFS нужен другой инструмент.','resize2fs /dev/vg_data/lv_app'],
 ['sudo','действие с другими привилегиями','warning','Обычно выполняет команду от root. Повышенные права не делают действие безопасным.','sudo apt install curl'],
 ['active','активна','success','systemd считает unit активным. Всё ещё нужна проверка полезного действия приложения.','systemctl status api'],
 ['running','выполняется','success','Процесс работает в этот момент. Это не доказательство исправности всей системы.','systemctl status api'],
 ['ready','готово','success','Программа сообщает о готовности. Подтверди это внешним действием.','curl http://localhost:8080/health'],
 ['successfully','успешно','success','Текстовый отчёт программы об операции. Оцени, что именно было проверено.','Проверь данные и функцию после операции.'],
 ['OK','успешный ответ','success','Относится к конкретной проверке, а не автоматически ко всей системе.','HTTP 200 OK'],
 ['failed','сбой','error','Операция или unit не достигли нужного состояния. Ищи причину рядом и в журнале.','journalctl -u api'],
 ['failure','неудачное завершение','error','Общий результат ошибки, а не сама первопричина.','systemctl status api'],
 ['ERROR','ошибка','error','Уровень сообщения в журнале. Успешное чтение ERROR-строк не означает успешную работу приложения.','grep ERROR /var/log/app.log'],
 ['Permission denied','доступ запрещён','error','Проверь пользователя процесса, rwx, родителей пути, ACL и политики безопасности.','namei -l /srv/app/config.env'],
 ['No such file or directory','файл или каталог не найден','error','Путь или одна из его частей не существует; также возможны отсутствующий интерпретатор или загрузчик.','ls -l /usr/local/bin/api'],
 ['not found','не найдено','error','Проверь имя, путь и наличие нужного файла или программы.','command -v curl'],
 ['Connection refused','соединение отклонено','error','TCP-соединение не установлено: например, нет слушающего процесса или есть явный REJECT. Это не то же самое, что HTTP 503.','ss -tulpn'],
 ['Network is unreachable','нет подходящего маршрута','error','Проверь состояние интерфейса и таблицу маршрутизации.','ip addr · ip route'],
 ['Could not resolve host','не удалось разрешить имя','error','Запрос не дошёл до HTTP: проверь разрешение имени.','dig api.internal'],
 ['timed out','время ожидания истекло','error','Ответ не пришёл в срок. Возможны потери, фильтрация, недоступный узел и другие причины.','Сравни путь по IP и по имени.'],
 ['WARN','предупреждение','warning','Ситуация требует внимания, но сообщение ещё не доказывает отказ всего сервиса.','Сопоставь журнал, метрики и симптомы.'],
 ['WARNING','предупреждение','warning','Прочитай причину до следующего действия.','ssh -v web1'],
 ['retry','повторная попытка','warning','Повторы могут восстановить связь, но без ограничений способны усилить инцидент.','journalctl -u api'],
 ['deprecated','устарело','warning','Функция пока может работать, но ей требуется поддерживаемая замена.','Проверь документацию инструмента.'],
 ['deleted','удалено имя файла','warning','Имя убрано, но открытый процессом файл ещё может занимать блоки.','lsof +L1'],
 ['BLOCKED','заблокировано','warning','Запрет бывает правильным результатом проверки безопасности. Смотри ожидаемую политику.','probe external'],
 ['INFO','информация','concept','Обычное событие: само по себе не успех и не ошибка.','tail -n 10 /var/log/app.log']
].map(([en,ru,kind,meaning,example])=>({en,ru,kind,meaning,example}));
const TERM_INDEX=new Map(LINUX_TERMS.map(t=>[t.en.toLowerCase(),t]));
const termEscape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const TERM_SOURCE=LINUX_TERMS.map(t=>t.en).sort((a,b)=>b.length-a.length).map(termEscape).join('|');
const FLAG_HELP={
 journalctl:{'-u':'только указанная служба (unit)','-n':'последние N записей','-p':'уровень важности сообщений','-f':'следить за новыми сообщениями','-b':'текущая загрузка'},
 systemctl:{'--now':'применить действие сейчас вместе с автозапуском','--quiet':'не печатать обычный вывод'},
 ls:{'-l':'подробности: права, владелец, размер','-a':'включая скрытые имена','-la':'подробный список со скрытыми именами'},
 grep:{'-i':'без учёта регистра','-v':'строки, которые НЕ совпали','-n':'показывать номера строк'},
 tail:{'-n':'количество последних строк','-f':'следить за добавлением строк'},
 head:{'-n':'количество первых строк'},
 df:{'-h':'размеры в удобных единицах','-i':'inode вместо блоков'},
 du:{'-sh':'суммарный размер в удобных единицах'},
 ss:{'-tulpn':'TCP + UDP, слушающие сокеты, процессы, числовые адреса'},
 curl:{'-I':'только HTTP-заголовки','-v':'подробности обмена','-f':'ненулевой код при HTTP-ошибке','--fail':'ненулевой код при HTTP-ошибке'},
 kill:{'-TERM':'SIGTERM: запросить корректное завершение','-USR1':'SIGUSR1: у nginx переоткрыть журналы','-9':'SIGKILL: принудительное завершение без очистки','-KILL':'SIGKILL: принудительное завершение без очистки'},
 lsblk:{'-f':'тип файловой системы и UUID'},
 tar:{'-tzf':'список файлов gzip-архива без распаковки','-xzf':'распаковать gzip-архив','-C':'целевой каталог'},
 rm:{'-r':'рекурсивное удаление каталога и содержимого'},
 lvextend:{'-L':'изменение размера в указанных единицах','-r':'расширить также файловую систему, если поддерживается'}
};
function flagMeaning(cmd,flag){return FLAG_HELP[cmd]?.[flag];}
function commandFlagHints(cmd){let name='',expectCommand=true;const seen=new Set(),flags=[];const tokens=cmd.match(/"(?:\\.|[^"\\])*"|'[^']*'|\|\||&&|>>|[|><;]|[^\s|><;]+/g)||[];for(const token of tokens){if(['|','||','&&',';'].includes(token)){expectCommand=true;continue;}if(['>','>>','<'].includes(token))continue;if(token==='sudo'&&expectCommand)continue;if(expectCommand){name=token;expectCommand=false;continue;}const meaning=flagMeaning(name,token),key=name+token;if(meaning&&!seen.has(key)){seen.add(key);flags.push({flag:token,meaning});}}return flags.length?`<div class="english-hints"><span class="english-hints-label">Опции команды</span>${flags.map(({flag,meaning})=>`<span class="term-chip flag-chip"><span class="sem-warning">${esc(flag)}</span><span>— ${esc(meaning)}</span></span>`).join('')}</div>`:'';}

function englishTerms(text,limit=6){const out=[],seen=new Set(),re=new RegExp('(^|[^A-Za-z0-9_])('+TERM_SOURCE+')(?=$|[^A-Za-z0-9_])','gi');for(const m of String(text).matchAll(re)){const t=TERM_INDEX.get(m[2].toLowerCase());if(t&&!(t.en==='active'&&text.slice(m.index+m[0].length).startsWith(':'))&&!seen.has(t.en)){seen.add(t.en);out.push(t);}}return out.slice(0,limit);}
function termSpan(text,kind,term){return `<span class="sem-${kind}"${term?` title="${esc(term.en+' — '+term.ru)}"`:''}>${esc(text)}</span>`;}
function highlightCommand(text){let out='',last=0,expectCommand=true;let name=text.match(/^\s*(?:sudo\s+)?([^\s|]+)/)?.[1];const re=/"(?:\\.|[^"\\])*"|'[^']*'|\|\||&&|>>|[|><;]|[^\s|><;]+/g;for(const m of text.matchAll(re)){out+=esc(text.slice(last,m.index));const value=m[0],term=TERM_INDEX.get(value.toLowerCase());let kind='data';if(/^(\||\|\||&&|>>|>|<|;)$/.test(value)){kind='warning';expectCommand=['|','||','&&',';'].includes(value);}else if(value==='sudo'){kind='warning';expectCommand=true;}else if(expectCommand){kind='command';expectCommand=false;name=value;}else if(value.startsWith('-'))kind='warning';else if(term&&['command','warning'].includes(term.kind))kind=term.kind;out+=termSpan(value,kind,term||(flagMeaning(name,value)?{en:value,ru:flagMeaning(name,value)}:null));last=m.index+value.length;}return out+esc(text.slice(last));}
function highlightOutput(text){const re=new RegExp('HTTP(?:/1\\.[01])?\\s+[1-5][0-9]{2}|(^|[^A-Za-z0-9_])('+TERM_SOURCE+')(?=$|[^A-Za-z0-9_])','gim');let html='',last=0;const expectedBlock=/BLOCKED.*ожидаемый запрет/.test(text);for(const m of String(text).matchAll(re)){html+=esc(text.slice(last,m.index));if(/^HTTP/.test(m[0])){const code=Number(m[0].match(/\d{3}$/)?.[0]);html+=termSpan(m[0],code>=400?'error':code>=300?'warning':code>=200?'success':'concept');}else{const prefix=m[1]||'',word=m[2],term=TERM_INDEX.get(word.toLowerCase());const field=word.toLowerCase()==='active'&&text.slice(m.index+m[0].length).startsWith(':');html+=esc(prefix)+termSpan(word,field?'concept':expectedBlock&&word.toUpperCase()==='BLOCKED'?'success':term.kind,field?{en:'Active:',ru:'поле состояния службы'}:term);}last=m.index+m[0].length;}return html+esc(text.slice(last));}
function termChips(text,limit=6){const terms=englishTerms(text,limit);return terms.length?`<div class="english-hints"><span class="english-hints-label">EN → смысл</span>${terms.map(t=>`<button class="term-chip" data-term="${esc(t.en)}"><span class="sem-${t.en==='BLOCKED'&&/BLOCKED.*ожидаемый запрет/.test(text)?'success':t.kind}">${esc(t.en)}</span><span>— ${esc(t.ru)}</span></button>`).join('')}</div>`:'';}
function colourLegend({compact=false}={}){return `<div class="colour-legend ${compact?'compact':''}" aria-label="Значения цветов"><span><i class="sem-dot command"></i><b>Синий</b> команда / компонент</span><span><i class="sem-dot success"></i><b>Зелёный</b> успех / подтверждение</span><span><i class="sem-dot warning"></i><b>Жёлтый</b> опция / внимание</span><span><i class="sem-dot error"></i><b>Красный</b> ошибка / отказ</span></div>`;}
function commandResult(r){if(/^(?:sudo\s+)?diff\b/.test(r.cmd)&&r.code===1)return '<span class="command-result sem-warning">exit 1 · найдены различия</span>';const noMatch=/^(?:sudo\s+)?grep\b/.test(r.cmd)&&r.code===1&&!r.output.trim();if(noMatch)return `<span class="command-result sem-warning">exit 1 · совпадений нет</span>`;return `<span class="command-result ${r.code?'sem-error':'sem-success'}">exit ${r.code||0} · ${r.code?'команда завершилась с ненулевым кодом':'команда завершилась без ошибки'}</span>`;}
function terminology(){return title('Английские слова начинают иметь смысл','Команды, состояния и сообщения — с переводом, ролью и контекстом.')+`<div class="card">${colourLegend()}<p class="source-note">Цвет помогает различать роль, но не заменяет чтение данных. Код 0 у grep означает успешный поиск строк, а не исправную систему. Красный ERROR может встретиться внутри успешно прочитанного журнала.</p></div><div class="toolbar spacer"><label class="screen-reader" for="term-search">Найти термин</label><input class="filter-input" id="term-search" placeholder="Например: failed, reload, права…"></div><div class="term-grid" id="term-results">${termRows(LINUX_TERMS)}</div>`;}
function termRows(terms){return terms.map(t=>`<button class="term-card" data-term="${esc(t.en)}"><span class="term-card-word sem-${t.kind}">${esc(t.en)}</span><strong>${esc(t.ru)}</strong><p>${esc(t.meaning)}</p><small>Разобрать пример →</small></button>`).join('');}
function termDialog(en){const t=TERM_INDEX.get(en.toLowerCase());if(!t)return;modal(`<div class="modal-head"><span class="tiny-label">СЛОВАРЬ В КОНТЕКСТЕ</span><button class="icon-button" data-action="close-modal" aria-label="Закрыть">×</button></div><div class="term-dialog-word sem-${t.kind}">${esc(t.en)}</div><h2>${esc(t.ru)}</h2><p class="section-intro">${esc(t.meaning)}</p><pre class="code-block">${/^(?:[a-z][a-z0-9-]*)(?:\s|$)/.test(t.example)?highlightCommand(t.example):highlightOutput(t.example)}</pre><p class="source-note">Пример для понимания. В учебном терминале доступно только подмножество команд из help.</p><button class="button" data-action="close-modal">Понятно</button>`);}
document.addEventListener('click',event=>{const el=event.target.closest('[data-term]');if(el)termDialog(el.dataset.term);});
document.addEventListener('input',event=>{if(event.target.id==='term-search'){const q=event.target.value.toLowerCase();document.querySelector('#term-results').innerHTML=termRows(LINUX_TERMS.filter(t=>(t.en+' '+t.ru+' '+t.meaning).toLowerCase().includes(q)))||'<p class="muted">Термин не найден. Попробуй другое слово.</p>';}});

