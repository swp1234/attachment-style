/* Attachment response reflection: all answers and scoring remain in this page. */
(async function () {
  'use strict';

  var TOTAL_SCENARIOS = 10;
  var TYPING_DELAY = 140;
  var REPLY_SHOW_DELAY = 60;
  var NEXT_SCENARIO_DELAY = 80;
  var TYPES = ['secure', 'anxious', 'avoidant', 'fearful'];
  var SCENARIO_MAP = Array.from({ length: TOTAL_SCENARIOS }, function () {
    return TYPES.slice();
  });
  var ALLOWED_SOURCES = ['direct', 'en_avoidant_guide_primary', 'fr_attachment_guide_primary', 'clarity_board', 'red_flag_retirement'];
  var ALLOWED_SURFACES = ['direct', 'intro_button', 'en_avoidant_guide_primary', 'fr_attachment_guide_primary', 'clarity_header', 'clarity_footer'];

  var BASE_COPY = {
    badge: 'Private reflection',
    title: 'Attachment response reflection',
    subtitle: 'What do your choices lean toward today?',
    description: 'Choose the reply closest to what you might actually send in 10 relationship situations.',
    infoScenarios: '10 scenarios',
    infoTime: 'About 3 min',
    infoStorage: 'Answers stay in this browser',
    boundary: 'Research tools such as the ECR-R use 36 items to measure attachment anxiety and avoidance. This 10-scenario activity is not the ECR-R, not a validated assessment, not a diagnosis, and not a prediction about your relationship.',
    start: 'Start the private reflection',
    resultLabel: 'Your current answer pattern',
    resultSummary: 'Among four response groups, this appeared most often in this run. It describes these 10 choices—not who you are or why you respond this way.',
    practiceHeading: 'One small experiment',
    practice: 'Before the next similar moment, name one feeling and one need. Then try one direct sentence instead of guessing, chasing, or disappearing.',
    resultBoundary: 'Treat this as a prompt, not a label. Answers can change by person, situation, mood, and time. No answer or result is sent in analytics or placed in a share link.',
    nextLabel: 'Next private step',
    nextTitle: 'Name what is under the reaction',
    nextAction: 'Open Emotion Iceberg',
    copy: 'Copy neutral link',
    retake: 'Reflect again',
    copied: 'Neutral link copied',
    aboutToggle: 'What this activity can and cannot tell you',
    aboutHeading: 'A reflection, not an attachment measure',
    aboutCopy: 'Adult attachment research commonly studies two continuous dimensions: anxiety and avoidance. Four labels can be derived from dimensions, but a short custom scenario activity cannot establish a stable type, explain your childhood, or diagnose a condition.'
  };

  var COPY = {
    en: {},
    ko: {
      badge: '비공개 자기성찰', title: '애착 반응 패턴 돌아보기', subtitle: '오늘 내 선택은 어느 쪽에 가까울까요?',
      description: '관계 속 10가지 상황에서 실제로 보낼 법한 답을 골라보세요.', infoScenarios: '10개 상황', infoTime: '약 3분', infoStorage: '응답은 이 브라우저에만 유지',
      boundary: 'ECR-R 같은 연구 도구는 36문항으로 애착 불안과 회피를 측정합니다. 이 10개 상황 활동은 ECR-R, 검증된 평가, 진단, 관계 예측이 아닙니다.',
      start: '비공개 성찰 시작', resultLabel: '이번 응답에서 두드러진 패턴',
      resultSummary: '네 가지 응답군 중 이번 선택에서 가장 자주 나타난 경향입니다. 10개 선택을 요약할 뿐, 당신이 어떤 사람인지나 원인을 설명하지 않습니다.',
      practiceHeading: '작은 실험 하나', practice: '비슷한 순간이 오면 감정 하나와 필요 하나를 먼저 이름 붙이고, 추측하거나 매달리거나 사라지는 대신 직접적인 한 문장을 말해보세요.',
      resultBoundary: '결과를 꼬리표가 아닌 질문거리로 사용하세요. 상대·상황·기분·시간에 따라 달라질 수 있으며, 응답과 결과는 분석 도구나 공유 링크로 전송되지 않습니다.',
      copy: '중립 링크 복사', retake: '다시 돌아보기', copied: '중립 링크를 복사했어요',
      aboutToggle: '이 활동이 알려줄 수 있는 것과 없는 것', aboutHeading: '애착 측정이 아닌 자기성찰',
      aboutCopy: '성인 애착 연구는 보통 불안과 회피라는 두 연속 차원을 살펴봅니다. 네 범주는 이 차원에서 파생할 수 있지만, 짧은 자체 상황 활동은 고정된 유형·어린 시절 원인·진단을 확정할 수 없습니다.'
    },
    zh: {
      badge: '私密反思', title: '依恋反应模式反思', subtitle: '今天的选择更偏向哪种反应？',
      description: '在10个关系情境中，选择最接近你真实回复的一项。', infoScenarios: '10个情境', infoTime: '约3分钟', infoStorage: '答案仅留在此浏览器',
      boundary: 'ECR-R等研究工具用36个题目测量依恋焦虑与回避。本活动只有10个情境，不是ECR-R、经验证的评估、诊断或关系预测。',
      start: '开始私密反思', resultLabel: '本次答案中较突出的模式',
      resultSummary: '在四组反应中，这一组在本次选择里出现最多。它只概括这10个答案，并不能定义你或解释原因。',
      practiceHeading: '一个小实验', practice: '下次遇到类似时刻，先说出一种感受和一种需要，再用一句直接的话表达，而不是猜测、追问或消失。',
      resultBoundary: '把结果当作提示，而不是标签。答案会随对象、情境、心情和时间变化；答案与结果不会发送到分析系统或分享链接。',
      copy: '复制中性链接', retake: '再次反思', copied: '已复制中性链接',
      aboutToggle: '这个活动能与不能告诉你的事', aboutHeading: '这是反思，不是依恋测量',
      aboutCopy: '成人依恋研究通常考察焦虑与回避两个连续维度。四种标签可由维度推导，但简短的自制情境活动无法确定稳定类型、解释童年或作出诊断。'
    },
    ja: {
      badge: '非公開の振り返り', title: '愛着反応パターンの振り返り', subtitle: '今日の選択はどの反応に近いでしょう？',
      description: '関係の10場面で、実際に送りそうな返事を選んでください。', infoScenarios: '10場面', infoTime: '約3分', infoStorage: '回答はこのブラウザ内のみ',
      boundary: 'ECR-Rなどの研究尺度は36項目で愛着不安と回避を測ります。この10場面の活動はECR-R、検証済み評価、診断、関係の予測ではありません。',
      start: '非公開で始める', resultLabel: '今回の回答で目立ったパターン',
      resultSummary: '4つの反応群のうち、今回もっとも多かった傾向です。10の選択をまとめるだけで、あなた自身や理由を決めるものではありません。',
      practiceHeading: '小さな実験を一つ', practice: '似た場面の前に、感情を一つ、必要を一つ言葉にし、推測・追跡・沈黙の代わりに直接的な一文を伝えてみましょう。',
      resultBoundary: 'ラベルではなく問いのきっかけとして使ってください。相手、状況、気分、時間で変わり、回答や結果は分析や共有リンクに送られません。',
      copy: '中立リンクをコピー', retake: 'もう一度振り返る', copied: '中立リンクをコピーしました',
      aboutToggle: 'この活動で分かること・分からないこと', aboutHeading: '愛着測定ではなく振り返り',
      aboutCopy: '成人愛着研究では通常、不安と回避という二つの連続次元を扱います。四分類を導くことはできますが、短い独自場面活動で安定した型、幼少期の原因、診断を確定することはできません。'
    },
    es: {
      badge: 'Reflexión privada', title: 'Reflexión sobre respuestas de apego', subtitle: '¿Hacia qué respuesta se inclinan hoy tus elecciones?',
      description: 'Elige la respuesta que más se parezca a la que enviarías en 10 situaciones de pareja.', infoScenarios: '10 situaciones', infoTime: 'Unos 3 min', infoStorage: 'Las respuestas quedan en este navegador',
      boundary: 'Instrumentos de investigación como el ECR-R usan 36 ítems para medir ansiedad y evitación. Esta actividad de 10 situaciones no es el ECR-R, una evaluación validada, un diagnóstico ni una predicción de pareja.',
      start: 'Empezar la reflexión privada', resultLabel: 'Patrón destacado en estas respuestas',
      resultSummary: 'De cuatro grupos de respuesta, este apareció más en esta sesión. Resume 10 elecciones; no define quién eres ni por qué respondes así.',
      practiceHeading: 'Un pequeño experimento', practice: 'Antes de un momento parecido, nombra una emoción y una necesidad. Luego prueba una frase directa en vez de adivinar, perseguir o desaparecer.',
      resultBoundary: 'Úsalo como pregunta, no como etiqueta. Puede cambiar según la persona, situación, ánimo y momento. Ninguna respuesta ni resultado se envía a analítica o a un enlace compartido.',
      copy: 'Copiar enlace neutral', retake: 'Reflexionar otra vez', copied: 'Enlace neutral copiado',
      aboutToggle: 'Lo que esta actividad puede y no puede decir', aboutHeading: 'Reflexión, no medición del apego',
      aboutCopy: 'La investigación adulta suele estudiar dos dimensiones continuas: ansiedad y evitación. Se pueden derivar cuatro etiquetas, pero una actividad breve propia no establece un tipo estable, una causa infantil ni un diagnóstico.'
    },
    pt: {
      badge: 'Reflexão privada', title: 'Reflexão sobre respostas de apego', subtitle: 'Para que lado suas escolhas apontam hoje?',
      description: 'Escolha a resposta mais parecida com o que você enviaria em 10 situações de relacionamento.', infoScenarios: '10 situações', infoTime: 'Cerca de 3 min', infoStorage: 'Respostas ficam neste navegador',
      boundary: 'Instrumentos como o ECR-R usam 36 itens para medir ansiedade e evitação. Esta atividade de 10 situações não é o ECR-R, uma avaliação validada, diagnóstico ou previsão do relacionamento.',
      start: 'Iniciar reflexão privada', resultLabel: 'Padrão em destaque nestas respostas',
      resultSummary: 'Entre quatro grupos, este apareceu mais nesta rodada. Ele resume 10 escolhas; não define quem você é nem por que responde assim.',
      practiceHeading: 'Um pequeno experimento', practice: 'Antes de um momento parecido, nomeie um sentimento e uma necessidade. Depois tente uma frase direta em vez de adivinhar, insistir ou sumir.',
      resultBoundary: 'Use como pergunta, não como rótulo. Pode mudar conforme pessoa, situação, humor e tempo. Respostas e resultados não vão para análises nem para o link compartilhado.',
      copy: 'Copiar link neutro', retake: 'Refletir novamente', copied: 'Link neutro copiado',
      aboutToggle: 'O que esta atividade pode e não pode dizer', aboutHeading: 'Reflexão, não medida de apego',
      aboutCopy: 'A pesquisa adulta costuma estudar duas dimensões contínuas: ansiedade e evitação. Quatro rótulos podem ser derivados, mas uma atividade curta própria não estabelece tipo estável, causa infantil ou diagnóstico.'
    },
    de: {
      badge: 'Private Reflexion', title: 'Reflexion über Bindungsreaktionen', subtitle: 'Wozu neigen deine Antworten heute?',
      description: 'Wähle in 10 Beziehungssituationen die Antwort, die du am ehesten senden würdest.', infoScenarios: '10 Situationen', infoTime: 'Etwa 3 Min.', infoStorage: 'Antworten bleiben in diesem Browser',
      boundary: 'Forschungsinstrumente wie der ECR-R messen Bindungsangst und Vermeidung mit 36 Items. Diese 10 Situationen sind weder ECR-R noch validierte Bewertung, Diagnose oder Beziehungsprognose.',
      start: 'Private Reflexion starten', resultLabel: 'Auffälliges Muster dieser Antworten',
      resultSummary: 'Von vier Antwortgruppen kam diese in diesem Durchgang am häufigsten vor. Sie fasst 10 Entscheidungen zusammen und definiert weder dich noch deren Ursache.',
      practiceHeading: 'Ein kleines Experiment', practice: 'Benenne vor einem ähnlichen Moment ein Gefühl und ein Bedürfnis. Probiere dann einen direkten Satz statt zu raten, zu drängen oder zu verschwinden.',
      resultBoundary: 'Nutze dies als Frage, nicht als Etikett. Antworten ändern sich mit Person, Situation, Stimmung und Zeit. Keine Antwort und kein Ergebnis wird an Analytics oder einen Freigabelink gesendet.',
      copy: 'Neutralen Link kopieren', retake: 'Noch einmal reflektieren', copied: 'Neutraler Link kopiert',
      aboutToggle: 'Was diese Aktivität sagen kann und was nicht', aboutHeading: 'Reflexion, kein Bindungsmaß',
      aboutCopy: 'Die Bindungsforschung untersucht meist zwei kontinuierliche Dimensionen: Angst und Vermeidung. Vier Kategorien lassen sich ableiten, doch eine kurze eigene Aktivität bestimmt weder stabilen Typ noch Kindheitsursache oder Diagnose.'
    },
    fr: {
      badge: 'Réflexion privée', title: 'Réflexion sur les réponses d’attachement', subtitle: 'Vers quelle réponse penchent vos choix aujourd’hui ?',
      description: 'Choisissez la réponse que vous enverriez le plus probablement dans 10 situations relationnelles.', infoScenarios: '10 situations', infoTime: 'Environ 3 min', infoStorage: 'Réponses gardées dans ce navigateur',
      boundary: 'Des outils de recherche comme l’ECR-R utilisent 36 items pour mesurer anxiété et évitement. Cette activité de 10 situations n’est ni l’ECR-R, ni une évaluation validée, un diagnostic ou une prédiction relationnelle.',
      start: 'Commencer la réflexion privée', resultLabel: 'Tendance de ces réponses',
      resultSummary: 'Parmi quatre groupes, celui-ci apparaît le plus dans cette session. Il résume 10 choix sans définir qui vous êtes ni leur cause.',
      practiceHeading: 'Une petite expérience', practice: 'Avant une situation semblable, nommez une émotion et un besoin. Essayez ensuite une phrase directe plutôt que de deviner, poursuivre ou disparaître.',
      resultBoundary: 'Utilisez ce résultat comme question, pas comme étiquette. Il varie selon la personne, la situation, l’humeur et le temps. Réponses et résultat ne sont envoyés ni à l’analytique ni au lien partagé.',
      copy: 'Copier le lien neutre', retake: 'Réfléchir à nouveau', copied: 'Lien neutre copié',
      aboutToggle: 'Ce que cette activité peut et ne peut pas dire', aboutHeading: 'Une réflexion, pas une mesure de l’attachement',
      aboutCopy: 'La recherche adulte étudie surtout deux dimensions continues : anxiété et évitement. Quatre catégories peuvent en être dérivées, mais une courte activité maison ne détermine ni type stable, ni cause infantile, ni diagnostic.'
    },
    id: {
      badge: 'Refleksi privat', title: 'Refleksi respons keterikatan', subtitle: 'Ke arah mana pilihanmu condong hari ini?',
      description: 'Pilih balasan yang paling mungkin kamu kirim dalam 10 situasi hubungan.', infoScenarios: '10 situasi', infoTime: 'Sekitar 3 menit', infoStorage: 'Jawaban tetap di browser ini',
      boundary: 'Alat riset seperti ECR-R memakai 36 butir untuk mengukur kecemasan dan penghindaran. Aktivitas 10 situasi ini bukan ECR-R, penilaian tervalidasi, diagnosis, atau ramalan hubungan.',
      start: 'Mulai refleksi privat', resultLabel: 'Pola yang menonjol pada jawaban ini',
      resultSummary: 'Dari empat kelompok respons, ini paling sering muncul pada sesi ini. Ini hanya merangkum 10 pilihan, bukan menetapkan siapa dirimu atau penyebabnya.',
      practiceHeading: 'Satu eksperimen kecil', practice: 'Sebelum momen serupa, sebutkan satu perasaan dan satu kebutuhan. Lalu coba satu kalimat langsung daripada menebak, mengejar, atau menghilang.',
      resultBoundary: 'Gunakan sebagai bahan tanya, bukan label. Jawaban dapat berubah menurut orang, situasi, suasana hati, dan waktu. Jawaban serta hasil tidak dikirim ke analitik atau tautan berbagi.',
      copy: 'Salin tautan netral', retake: 'Refleksi lagi', copied: 'Tautan netral disalin',
      aboutToggle: 'Yang dapat dan tidak dapat dijelaskan aktivitas ini', aboutHeading: 'Refleksi, bukan pengukuran keterikatan',
      aboutCopy: 'Riset keterikatan dewasa biasanya mempelajari dua dimensi berkelanjutan: kecemasan dan penghindaran. Empat label dapat diturunkan, tetapi aktivitas singkat buatan sendiri tidak menetapkan tipe stabil, penyebab masa kecil, atau diagnosis.'
    },
    tr: {
      badge: 'Özel yansıtma', title: 'Bağlanma tepkileri üzerine düşünme', subtitle: 'Bugünkü seçimlerin hangi tepkiye yaklaşıyor?',
      description: '10 ilişki durumunda gerçekten göndereceğin yanıta en yakın olanı seç.', infoScenarios: '10 durum', infoTime: 'Yaklaşık 3 dk', infoStorage: 'Yanıtlar bu tarayıcıda kalır',
      boundary: 'ECR-R gibi araştırma araçları bağlanma kaygısı ve kaçınmayı 36 maddeyle ölçer. Bu 10 durum ECR-R, doğrulanmış değerlendirme, tanı veya ilişki tahmini değildir.',
      start: 'Özel yansıtmayı başlat', resultLabel: 'Bu yanıtlarda öne çıkan örüntü',
      resultSummary: 'Dört yanıt grubundan bu turda en sık bu görüldü. Yalnızca 10 seçimi özetler; kim olduğunu veya nedenini belirlemez.',
      practiceHeading: 'Küçük bir deney', practice: 'Benzer bir andan önce bir duygu ve bir ihtiyaç adlandır. Tahmin etmek, peşinden gitmek ya da kaybolmak yerine doğrudan bir cümle dene.',
      resultBoundary: 'Bunu etiket değil soru olarak kullan. Kişi, durum, ruh hali ve zamana göre değişebilir. Yanıtlar ve sonuç analitiğe ya da paylaşım bağlantısına gönderilmez.',
      copy: 'Nötr bağlantıyı kopyala', retake: 'Yeniden düşün', copied: 'Nötr bağlantı kopyalandı',
      aboutToggle: 'Bu etkinliğin söyleyebilecekleri ve söyleyemeyecekleri', aboutHeading: 'Bağlanma ölçümü değil, yansıtma',
      aboutCopy: 'Yetişkin bağlanma araştırması çoğunlukla kaygı ve kaçınma adlı iki sürekli boyutu inceler. Dört etiket türetilebilir; ancak kısa ve özel bir etkinlik kalıcı tip, çocukluk nedeni veya tanı belirleyemez.'
    },
    ru: {
      badge: 'Личная рефлексия', title: 'Рефлексия реакций привязанности', subtitle: 'К чему склоняются ваши ответы сегодня?',
      description: 'Выберите наиболее вероятный ответ в 10 ситуациях отношений.', infoScenarios: '10 ситуаций', infoTime: 'Около 3 минут', infoStorage: 'Ответы остаются в браузере',
      boundary: 'Исследовательские шкалы вроде ECR-R используют 36 пунктов для измерения тревоги и избегания. Эти 10 ситуаций — не ECR-R, не валидированная оценка, не диагноз и не прогноз отношений.',
      start: 'Начать личную рефлексию', resultLabel: 'Паттерн, заметный в этих ответах',
      resultSummary: 'Из четырёх групп эта встречалась чаще в данном прохождении. Она описывает 10 выборов, но не определяет вас и причины ваших реакций.',
      practiceHeading: 'Один небольшой эксперимент', practice: 'Перед похожим моментом назовите одно чувство и одну потребность. Затем попробуйте одну прямую фразу вместо догадок, преследования или исчезновения.',
      resultBoundary: 'Используйте результат как вопрос, а не ярлык. Ответы меняются с человеком, ситуацией, настроением и временем. Ответы и результат не отправляются в аналитику или ссылку.',
      copy: 'Скопировать нейтральную ссылку', retake: 'Пройти ещё раз', copied: 'Нейтральная ссылка скопирована',
      aboutToggle: 'Что это упражнение может и не может показать', aboutHeading: 'Рефлексия, а не измерение привязанности',
      aboutCopy: 'Исследования привязанности взрослых обычно рассматривают две непрерывные шкалы: тревогу и избегание. Четыре категории можно вывести, но короткое авторское упражнение не определяет устойчивый тип, причины детства или диагноз.'
    },
    hi: {
      badge: 'निजी आत्मचिंतन', title: 'लगाव प्रतिक्रियाओं पर आत्मचिंतन', subtitle: 'आज आपके चुनाव किस प्रतिक्रिया की ओर झुकते हैं?',
      description: 'रिश्ते की 10 स्थितियों में वह जवाब चुनें जो आप सच में भेज सकते हैं।', infoScenarios: '10 स्थितियाँ', infoTime: 'लगभग 3 मिनट', infoStorage: 'जवाब इसी ब्राउज़र में रहते हैं',
      boundary: 'ECR-R जैसे शोध उपकरण लगाव की चिंता और दूरी को 36 मदों से मापते हैं। यह 10-स्थिति गतिविधि ECR-R, प्रमाणित आकलन, निदान या रिश्ते की भविष्यवाणी नहीं है।',
      start: 'निजी आत्मचिंतन शुरू करें', resultLabel: 'इन जवाबों में उभरा पैटर्न',
      resultSummary: 'चार प्रतिक्रिया समूहों में यह इस बार सबसे अधिक दिखा। यह केवल 10 चुनावों का सार है; यह आपको या उसके कारण को परिभाषित नहीं करता।',
      practiceHeading: 'एक छोटा प्रयोग', practice: 'अगली समान स्थिति से पहले एक भावना और एक ज़रूरत का नाम लें। अनुमान लगाने, पीछा करने या गायब होने के बजाय एक सीधा वाक्य कहें।',
      resultBoundary: 'इसे सवाल की तरह लें, लेबल की तरह नहीं। व्यक्ति, स्थिति, मनोदशा और समय से जवाब बदल सकते हैं। जवाब या नतीजा एनालिटिक्स अथवा साझा लिंक में नहीं भेजा जाता।',
      copy: 'तटस्थ लिंक कॉपी करें', retake: 'फिर आत्मचिंतन करें', copied: 'तटस्थ लिंक कॉपी हुआ',
      aboutToggle: 'यह गतिविधि क्या बता सकती है और क्या नहीं', aboutHeading: 'आत्मचिंतन, लगाव का माप नहीं',
      aboutCopy: 'वयस्क लगाव शोध आम तौर पर चिंता और दूरी की दो निरंतर दिशाएँ देखता है। चार श्रेणियाँ निकाली जा सकती हैं, पर छोटी स्वनिर्मित गतिविधि स्थिर प्रकार, बचपन का कारण या निदान तय नहीं कर सकती।'
    }
  };

  var TYPE_NAMES = {
    en: ['Steady-and-direct', 'Reassurance-seeking', 'Distance-seeking', 'Approach-and-retreat'],
    ko: ['안정적이고 직접적인 반응', '확인을 구하는 반응', '거리를 두는 반응', '다가감과 물러남이 섞인 반응'],
    zh: ['稳定而直接', '寻求确认', '保持距离', '靠近与退缩交替'],
    ja: ['安定して直接的', '安心確認を求める', '距離を求める', '接近と後退が混ざる'],
    es: ['Estable y directa', 'Búsqueda de seguridad', 'Búsqueda de distancia', 'Acercamiento y retirada'],
    pt: ['Estável e direta', 'Busca de reafirmação', 'Busca de distância', 'Aproximação e recuo'],
    de: ['Stabil und direkt', 'Bestätigung suchend', 'Distanz suchend', 'Annäherung und Rückzug'],
    fr: ['Stable et directe', 'En quête de réassurance', 'En quête de distance', 'Approche et retrait'],
    id: ['Stabil dan langsung', 'Mencari kepastian', 'Mencari jarak', 'Mendekat lalu mundur'],
    tr: ['Dengeli ve doğrudan', 'Güvence arayan', 'Mesafe arayan', 'Yaklaşan ve geri çekilen'],
    ru: ['Устойчивый и прямой', 'Ищущий подтверждения', 'Ищущий дистанции', 'Сближение и отступление'],
    hi: ['स्थिर और सीधी', 'भरोसा खोजने वाली', 'दूरी खोजने वाली', 'पास आना और पीछे हटना']
  };
  var TYPE_SYMBOLS = ['◆', '○', '↔', '◇'];

  var HERO_RECOMMENDATIONS = {
    anxious: {
      url: '/stress-check/',
      label: {
        en: 'Recommended next step', ko: '추천 다음 단계', zh: '推荐下一步', ja: 'おすすめの次の一歩',
        es: 'Siguiente paso recomendado', pt: 'Próximo passo recomendado', de: 'Empfohlener nächster Schritt', fr: 'Étape suivante recommandée',
        id: 'Langkah selanjutnya yang disarankan', tr: 'Önerilen sonraki adım', ru: 'Рекомендуемый следующий шаг', hi: 'अनुशंसित अगला कदम'
      },
      title: {
        en: 'Explore somatic & relationship stress triggers', ko: '신체 및 관계 스트레스 요인 점검하기', zh: '了解身体与关系中的压力触发点', ja: '身体と関係性のストレス要因をチェック',
        es: 'Explora los detonantes de estrés somático y vincular', pt: 'Explore os gatilhos de estresse somático e relacional', de: 'Erforsche somatische und Beziehungs-Stresstrigger', fr: 'Explorez vos déclencheurs de stress somatique et relationnel',
        id: 'Jelajahi pemicu stres somatik & relasional', tr: 'Bedensel ve ilişkisel stres tetikleyicilerini keşfet', ru: 'Исследуйте телесные и отношенческие триггеры стресса', hi: 'शारीरिक और रिश्ते से जुड़े तनाव के कारणों को समझें'
      },
      action: {
        en: 'Take Stress Check', ko: '스트레스 지수 측정하기', zh: '开始压力自测', ja: 'ストレス診断を受ける',
        es: 'Hacer test de estrés', pt: 'Fazer teste de estresse', de: 'Stresstest starten', fr: 'Faire le test de stress',
        id: 'Mulai Tes Stres', tr: 'Stres Testini Başlat', ru: 'Пройти тест на стресс', hi: 'तनाव टेस्ट शुरू करें'
      }
    },
    avoidant: {
      url: '/emotion-iceberg/',
      label: {
        en: 'Recommended next step', ko: '추천 다음 단계', zh: '推荐下一步', ja: 'おすすめの次の一歩',
        es: 'Siguiente paso recomendado', pt: 'Próximo passo recomendado', de: 'Empfohlener nächster Schritt', fr: 'Étape suivante recommandée',
        id: 'Langkah selanjutnya yang disarankan', tr: 'Önerilen sonraki adım', ru: 'Рекомендуемый следующий шаг', hi: 'अनुशंसित अगला कदम'
      },
      title: {
        en: 'Name what is under the protective shield', ko: '방어 반응 아래 숨은 감정 알아차리기', zh: '觉察保护外壳之下的真实感受', ja: '防御的な反応の奥にある感情に気づく',
        es: 'Nombra lo que hay bajo el escudo protector', pt: 'Nomeie o que está sob o escudo protetor', de: 'Benenne, was unter dem Schutzschild liegt', fr: 'Nommez ce qui se cache sous votre bouclier protecteur',
        id: 'Kenali apa yang ada di balik tameng pelindung', tr: 'Koruyucu kalkanın altındakini adlandır', ru: 'Осознайте, что скрывается под защитным панцирем', hi: 'सुरक्षा कवच के नीचे छिपी भावनाओं को पहचानें'
      },
      action: {
        en: 'Open Emotion Iceberg', ko: '감정 빙산 탐색하기', zh: '打开情绪冰山', ja: '感情の氷山を開く',
        es: 'Abrir Iceberg de Emociones', pt: 'Abrir Iceberg das Emoções', de: 'Emotions-Eisberg öffnen', fr: 'Ouvrir l’Iceberg des émotions',
        id: 'Buka Gunung Es Emosi', tr: 'Duygu Buzdağını Aç', ru: 'Открыть айсберг эмоций', hi: 'भावनाओं का हिमशैल खोलें'
      }
    },
    fearful: {
      url: '/hsp-test/',
      label: {
        en: 'Recommended next step', ko: '추천 다음 단계', zh: '推荐下一步', ja: 'おすすめの次の一歩',
        es: 'Siguiente paso recomendado', pt: 'Próximo passo recomendado', de: 'Empfohlener nächster Schritt', fr: 'Étape suivante recommandée',
        id: 'Langkah selanjutnya yang disarankan', tr: 'Önerilen sonraki adım', ru: 'Рекомендуемый следующий шаг', hi: 'अनुशंसित अगला कदम'
      },
      title: {
        en: 'Assess sensory & emotional sensitivity overload', ko: '감각 및 정서적 민감도와 과부하 점검하기', zh: '评估感官与情绪敏感度过载', ja: '感覚と感情の過負荷・繊細さをチェック',
        es: 'Evalúa la sobrecarga sensorial y emocional', pt: 'Avalie a sobrecarga sensorial e emocional', de: 'Überprüfe sensorische und emotionale Reizüberflutung', fr: 'Évaluez la surcharge sensorielle et émotionnelle',
        id: 'Periksa kepekaan sensorik & emosional berlebih', tr: 'Duyusal ve duygusal hassasiyet yükünü değerlendir', ru: 'Оцените сенсорную и эмоциональную перегрузку', hi: 'संवेदी और भावनात्मक संवेदनशीलता अधिभार का आकलन करें'
      },
      action: {
        en: 'Take HSP Test', ko: 'HSP 민감성 테스트하기', zh: '开始高敏感测试', ja: 'HSP診断を受ける',
        es: 'Hacer test PAS (HSP)', pt: 'Fazer teste PAS (HSP)', de: 'HSP-Test starten', fr: 'Faire le test HSP',
        id: 'Mulai Tes HSP', tr: 'HSP Hassasiyet Testini Başlat', ru: 'Пройти тест на HSP', hi: 'HSP संवेदनशीलता टेस्ट शुरू करें'
      }
    },
    secure: {
      url: '/future-self/',
      label: {
        en: 'Recommended next step', ko: '추천 다음 단계', zh: '推荐下一步', ja: 'おすすめの次の一歩',
        es: 'Siguiente paso recomendado', pt: 'Próximo passo recomendado', de: 'Empfohlener nächster Schritt', fr: 'Étape suivante recommandée',
        id: 'Langkah selanjutnya yang disarankan', tr: 'Önerilen sonraki adım', ru: 'Рекомендуемый следующий шаг', hi: 'अनुशंसित अगला कदम'
      },
      title: {
        en: 'Envision your trajectory & future alignment', ko: '앞으로의 삶의 궤적과 미래 방향성 설계하기', zh: '描绘未来生活轨迹与成长方向', ja: '未来の自分との調和と歩みを思い描く',
        es: 'Visualiza tu trayectoria y alineación futura', pt: 'Visualize sua trajetória e alinhamento futuro', de: 'Entwirf deinen Lebensweg und Zukunftsausrichtung', fr: 'Visualisez votre trajectoire et vos aspirations futures',
        id: 'Rancang arah hidup & keselarasan masa depan', tr: 'Gelecekteki yönünü ve uyumunu tasarla', ru: 'Спроектируйте траекторию и вектор будущего', hi: 'अपने भविष्य की दिशा और संतुलन की कल्पना करें'
      },
      action: {
        en: 'Explore Future Self', ko: '미래의 나 만나보기', zh: '探索未来的自己', ja: '未来の自分を見つめる',
        es: 'Explorar tu Yo Futuro', pt: 'Explorar seu Eu Futuro', de: 'Zukunfts-Ich erkunden', fr: 'Explorer votre Moi Futur',
        id: 'Jelajahi Diri Masa Depan', tr: 'Gelecekteki Kendini Keşfet', ru: 'Узнать своё будущее Я', hi: 'अपने भविष्य के स्वरूप को जानें'
      }
    }
  };

  try {
    await i18n.loadTranslations(i18n.currentLang);
    i18n.updateUI();

    var currentScenario = 0;
    var scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };
    var currentResult = null;
    var isAnimating = false;
    var autoStartConsumed = false;
    var launch = getLaunchParams();

    var startScreen = document.getElementById('start-screen');
    var chatScreen = document.getElementById('chat-screen');
    var resultScreen = document.getElementById('result-screen');
    var startBtn = document.getElementById('start-btn');
    var chatArea = document.getElementById('chat-area');
    var replyHint = document.getElementById('reply-hint');
    var replyOptions = document.getElementById('reply-options');
    var chatCounter = document.getElementById('chat-counter');
    var phoneStatus = document.getElementById('phone-status');
    var statusTime = document.getElementById('status-time');
    var themeToggle = document.getElementById('theme-toggle');
    var langSelect = document.getElementById('lang-select');
    var retakeBtn = document.getElementById('retake-btn');
    var shareCopy = document.getElementById('share-copy');
    var primaryRelatedCta = document.getElementById('primary-related-cta');
    var aboutDetails = document.getElementById('about-details');

    function pick(value, allowed, fallback) {
      return allowed.indexOf(value) !== -1 ? value : fallback;
    }

    function getLaunchParams() {
      try {
        var params = new URLSearchParams(window.location.search || '');
        var sourceHint = params.get('source') || params.get('surface') || 'direct';
        return {
          shouldStart: params.get('start') === '1',
          source: pick(sourceHint, ALLOWED_SOURCES, 'direct'),
          surface: pick(params.get('surface') || 'direct', ALLOWED_SURFACES, 'direct')
        };
      } catch (error) {
        return { shouldStart: false, source: 'direct', surface: 'direct' };
      }
    }

    function eventContext(surface) {
      return {
        event_category: 'attachment_reflection',
        lang: i18n.currentLang || 'en',
        source: launch.source,
        surface: pick(surface || launch.surface, ALLOWED_SURFACES, 'direct')
      };
    }

    function trackEvent(name, params) {
      var payload = params || {};
      if (typeof gtag === 'function') gtag('event', name, payload);
      else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(Object.assign({ event: name }, payload));
      }
    }

    function localeCopy() {
      return Object.assign({}, BASE_COPY, COPY[i18n.currentLang] || COPY.en);
    }

    function setText(id, value) {
      var node = document.getElementById(id);
      if (node) node.textContent = value;
    }

    function syncRelatedUrls() {
      var lang = i18n.currentLang || 'en';
      var relatedLinks = document.querySelectorAll('#related-grid .related-card');
      Array.prototype.forEach.call(relatedLinks, function (link) {
        var baseHref = link.getAttribute('href').split('?')[0];
        link.setAttribute('href', baseHref + '?lang=' + encodeURIComponent(lang) + '&source=attachment_style');
      });
    }

    function applyNextStepRecommendation(primaryType) {
      var typeKey = primaryType || (currentResult && currentResult.primary) || 'anxious';
      var rec = HERO_RECOMMENDATIONS[typeKey] || HERO_RECOMMENDATIONS.anxious;
      var lang = i18n.currentLang || 'en';
      var label = (rec.label && rec.label[lang]) || rec.label.en;
      var title = (rec.title && rec.title[lang]) || rec.title.en;
      var action = (rec.action && rec.action[lang]) || rec.action.en;

      setText('next-step-label', label);
      setText('next-step-title', title);
      var cta = document.getElementById('primary-related-cta');
      if (cta) {
        cta.textContent = action;
        cta.setAttribute('href', rec.url + '?lang=' + encodeURIComponent(lang) + '&source=attachment_style');
        cta.setAttribute('data-related-key', typeKey);
      }
      syncRelatedUrls();
    }

    function applyReflectionCopy() {
      var copy = localeCopy();
      setText('reflection-badge', copy.badge);
      setText('reflection-title', copy.title);
      setText('reflection-subtitle', copy.subtitle);
      setText('reflection-description', copy.description);
      setText('reflection-info-scenarios', copy.infoScenarios);
      setText('reflection-info-time', copy.infoTime);
      setText('reflection-info-storage', copy.infoStorage);
      setText('reflection-boundary', copy.boundary);
      setText('start-btn', copy.start);
      setText('result-label', copy.resultLabel);
      setText('practice-heading', copy.practiceHeading);
      setText('result-boundary', copy.resultBoundary);
      applyNextStepRecommendation((currentResult && currentResult.primary) || 'anxious');
      setText('share-copy', copy.copy);
      setText('retake-btn', copy.retake);
      setText('about-toggle', copy.aboutToggle);
      setText('about-heading', copy.aboutHeading);
      setText('about-copy', copy.aboutCopy);
      document.title = copy.title + ' | DopaBrain';
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = copy.description + ' ' + copy.boundary;
      if (currentResult && resultScreen.classList.contains('active')) renderResult(false);
    }

    function initTheme() {
      var saved = localStorage.getItem('theme');
      document.documentElement.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark');
    }

    function showScreen(screen) {
      [startScreen, chatScreen, resultScreen].forEach(function (item) { item.classList.remove('active'); });
      screen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function startReflection(surface) {
      currentScenario = 0;
      scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };
      currentResult = null;
      chatArea.innerHTML = '';
      trackEvent('attachment_reflection_start', Object.assign(eventContext(surface), { scenario_count: TOTAL_SCENARIOS }));
      showScreen(chatScreen);
      renderScenario(0, false);
    }

    function renderScenario(index, rerender) {
      if (isAnimating && !rerender) return;
      isAnimating = true;
      var number = index + 1;
      chatCounter.textContent = number + ' / ' + TOTAL_SCENARIOS;
      replyOptions.innerHTML = '';
      replyOptions.classList.add('hidden');
      replyHint.style.display = 'none';

      if (rerender) {
        showReplyOptions(index);
        isAnimating = false;
        return;
      }

      var context = i18n.t('scenarios.s' + number + '.context');
      var contextNode = document.createElement('div');
      contextNode.className = 'chat-context';
      var contextText = document.createElement('span');
      contextText.textContent = context;
      contextNode.appendChild(contextText);
      chatArea.appendChild(contextNode);
      showTypingIndicator();
      window.setTimeout(function () {
        removeTypingIndicator();
        addBubble(i18n.t('scenarios.s' + number + '.partnerMsg'), 'incoming');
        window.setTimeout(function () {
          showReplyOptions(index);
          isAnimating = false;
        }, REPLY_SHOW_DELAY);
      }, TYPING_DELAY);
    }

    function showTypingIndicator() {
      phoneStatus.textContent = i18n.t('chat.typing') || 'typing...';
      var node = document.createElement('div');
      node.id = 'typing-indicator';
      node.className = 'typing-indicator';
      node.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      chatArea.appendChild(node);
      scrollChat();
    }

    function removeTypingIndicator() {
      var node = document.getElementById('typing-indicator');
      if (node) node.remove();
      phoneStatus.textContent = i18n.t('chat.online') || 'online';
    }

    function addBubble(text, kind) {
      var bubble = document.createElement('div');
      bubble.className = 'chat-bubble ' + (kind === 'incoming' ? 'bubble-incoming' : 'bubble-outgoing bubble-sending');
      bubble.textContent = text;
      chatArea.appendChild(bubble);
      scrollChat();
    }

    function showReplyOptions(index) {
      var number = index + 1;
      ['a', 'b', 'c', 'd'].forEach(function (key) {
        var button = document.createElement('button');
        button.className = 'reply-btn';
        button.type = 'button';
        button.textContent = i18n.t('scenarios.s' + number + '.options.' + key);
        button.addEventListener('click', function () { selectReply(index, key); });
        replyOptions.appendChild(button);
      });
      replyHint.style.display = 'block';
      replyOptions.classList.remove('hidden');
    }

    function selectReply(index, key) {
      if (isAnimating) return;
      isAnimating = true;
      var optionIndex = ['a', 'b', 'c', 'd'].indexOf(key);
      scores[SCENARIO_MAP[index][optionIndex]] += 1;
      var buttons = replyOptions.querySelectorAll('.reply-btn');
      Array.prototype.forEach.call(buttons, function (button) { button.disabled = true; });
      buttons[optionIndex].classList.add('selected');
      window.setTimeout(function () {
        addBubble(i18n.t('scenarios.s' + (index + 1) + '.options.' + key), 'outgoing');
        replyOptions.classList.add('hidden');
        replyHint.style.display = 'none';
        window.setTimeout(function () {
          if (currentScenario < TOTAL_SCENARIOS - 1) {
            currentScenario += 1;
            isAnimating = false;
            renderScenario(currentScenario, false);
          } else {
            currentResult = getResult();
            showScreen(resultScreen);
            renderResult(true);
            isAnimating = false;
          }
        }, NEXT_SCENARIO_DELAY);
      }, 100);
    }

    function getResult() {
      var sorted = TYPES.slice().sort(function (a, b) { return scores[b] - scores[a]; });
      return { primary: sorted[0] };
    }

    function renderResult(emitComplete) {
      if (!currentResult) return;
      var index = TYPES.indexOf(currentResult.primary);
      var names = TYPE_NAMES[i18n.currentLang] || TYPE_NAMES.en;
      var copy = localeCopy();
      setText('result-emoji', TYPE_SYMBOLS[index]);
      setText('result-type', names[index]);
      setText('result-desc', copy.resultSummary);
      setText('result-advice', copy.practice);
      applyNextStepRecommendation(currentResult.primary);
      if (emitComplete) {
        trackEvent('attachment_reflection_complete', Object.assign(eventContext(launch.surface), { scenario_count: TOTAL_SCENARIOS }));
      }
    }

    function scrollChat() {
      window.requestAnimationFrame(function () { chatArea.scrollTop = chatArea.scrollHeight; });
    }

    function neutralShareUrl() {
      var url = new URL('https://dopabrain.com/attachment-style/');
      url.searchParams.set('lang', i18n.currentLang || 'en');
      return url.toString();
    }

    function copied() {
      showToast(localeCopy().copied);
      trackEvent('attachment_reflection_share', Object.assign(eventContext('direct'), { method: 'copy' }));
    }

    function showToast(message) {
      var old = document.querySelector('.toast');
      if (old) old.remove();
      var toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      window.requestAnimationFrame(function () { toast.classList.add('show'); });
      window.setTimeout(function () {
        toast.classList.remove('show');
        window.setTimeout(function () { toast.remove(); }, 300);
      }, 1800);
    }

    startBtn.addEventListener('click', function () { startReflection('intro_button'); });
    retakeBtn.addEventListener('click', function () {
      trackEvent('attachment_reflection_restart', eventContext('direct'));
      showScreen(startScreen);
    });
    shareCopy.addEventListener('click', function () {
      var url = neutralShareUrl();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(copied).catch(function () {
          fallbackCopy(url);
        });
      } else fallbackCopy(url);
    });

    function fallbackCopy(url) {
      var input = document.createElement('textarea');
      input.value = url;
      input.setAttribute('readonly', '');
      document.body.appendChild(input);
      input.select();
      var success = false;
      try { success = document.execCommand('copy'); } catch (error) { success = false; }
      input.remove();
      if (success) copied();
    }

    primaryRelatedCta.addEventListener('click', function () {
      var targetSlug = primaryRelatedCta.getAttribute('href') || 'related';
      trackEvent('attachment_reflection_related_click', Object.assign(eventContext('direct'), { target_slug: targetSlug, is_hero: true }));
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'content_cta_click', {
          event_category: 'engagement',
          page_path: location.pathname,
          target_url: primaryRelatedCta.href,
          link_id: 'attachment_style_primary_cta'
        });
      }
    });
    var relatedCards = document.querySelectorAll('#related-grid .related-card');
    Array.prototype.forEach.call(relatedCards, function (card) {
      card.addEventListener('click', function () {
        var key = card.getAttribute('data-related-key') || card.getAttribute('href');
        trackEvent('attachment_reflection_related_click', Object.assign(eventContext('direct'), { target_slug: key, is_hero: false }));
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'content_cta_click', {
            event_category: 'engagement',
            page_path: location.pathname,
            target_url: card.href,
            link_id: 'attachment_style_related_' + (card.getAttribute('data-related-key') || 'link')
          });
        }
      });
    });
    aboutDetails.addEventListener('toggle', function () {
      if (aboutDetails.open) trackEvent('attachment_reflection_evidence_open', eventContext('direct'));
    });
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
    langSelect.value = i18n.currentLang;
    langSelect.addEventListener('change', async function () {
      await i18n.setLanguage(this.value);
      applyReflectionCopy();
      if (chatScreen.classList.contains('active')) renderScenario(currentScenario, true);
    });

    function updateClock() {
      var now = new Date();
      statusTime.textContent = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    }

    initTheme();
    applyReflectionCopy();
    updateClock();
    window.setInterval(updateClock, 30000);
    var loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');

    window.setTimeout(function () {
      if (document.visibilityState === 'visible') trackEvent('attachment_reflection_view', eventContext(launch.surface));
    }, 500);

    if (launch.shouldStart) {
      window.setTimeout(function () {
        if (autoStartConsumed || !startScreen.classList.contains('active')) return;
        autoStartConsumed = true;
        startReflection(launch.surface);
      }, 250);
    }
  } catch (error) {
    console.error('Attachment reflection init error:', error);
    var loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');
  }
})();
