/* ========================================
   Attachment Style Test - App Logic
   10 scenario-based questions
   4 types: secure, anxious, avoidant, fearful
   ======================================== */

(async function () {
  try {
    // Wait for i18n
    await i18n.loadTranslations(i18n.currentLang);
    i18n.updateUI();

    // --- State ---
    const TOTAL_QUESTIONS = 10;
    let currentQuestion = 0;
    let scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };

    // Question mapping: each option maps to a type
    const questionMap = [
      { options: ['secure', 'anxious', 'avoidant', 'fearful'] },
      { options: ['anxious', 'secure', 'fearful', 'avoidant'] },
      { options: ['avoidant', 'fearful', 'secure', 'anxious'] },
      { options: ['secure', 'anxious', 'avoidant', 'fearful'] },
      { options: ['fearful', 'avoidant', 'anxious', 'secure'] },
      { options: ['anxious', 'fearful', 'secure', 'avoidant'] },
      { options: ['avoidant', 'secure', 'fearful', 'anxious'] },
      { options: ['secure', 'fearful', 'anxious', 'avoidant'] },
      { options: ['fearful', 'anxious', 'avoidant', 'secure'] },
      { options: ['avoidant', 'anxious', 'secure', 'fearful'] }
    ];

    // --- DOM Elements ---
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const progressFill = document.getElementById('progress-fill');
    const currentQEl = document.getElementById('current-q');
    const totalQEl = document.getElementById('total-q');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const quizCard = document.querySelector('.quiz-card');
    const themeToggle = document.getElementById('theme-toggle');
    const langSelect = document.getElementById('lang-select');
    const retakeBtn = document.getElementById('retake-btn');
    const shareTwitter = document.getElementById('share-twitter');
    const shareCopy = document.getElementById('share-copy');

    // --- Theme ---
    function initTheme() {
      const saved = localStorage.getItem('theme');
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }

    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    initTheme();

    // --- Language ---
    langSelect.value = i18n.currentLang;

    langSelect.addEventListener('change', async function () {
      await i18n.setLanguage(this.value);
      // Re-render current screen content
      if (quizScreen.classList.contains('active')) {
        renderQuestion(currentQuestion);
      }
      if (resultScreen.classList.contains('active')) {
        showResult();
      }
    });

    // --- Screen Navigation ---
    function showScreen(screen) {
      [startScreen, quizScreen, resultScreen].forEach(function (s) {
        s.classList.remove('active');
      });
      screen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Start Quiz ---
    startBtn.addEventListener('click', function () {
      currentQuestion = 0;
      scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };
      showScreen(quizScreen);
      renderQuestion(0);
    });

    // --- Render Question ---
    function renderQuestion(index) {
      var qNum = index + 1;
      currentQEl.textContent = qNum;
      totalQEl.textContent = TOTAL_QUESTIONS;
      progressFill.style.width = ((qNum / TOTAL_QUESTIONS) * 100) + '%';

      var qKey = 'questions.q' + qNum + '.text';
      questionText.textContent = i18n.t(qKey);

      optionsContainer.innerHTML = '';
      var optionKeys = ['a', 'b', 'c', 'd'];

      optionKeys.forEach(function (key) {
        var btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = i18n.t('questions.q' + qNum + '.options.' + key);
        btn.addEventListener('click', function () {
          selectOption(index, key);
        });
        optionsContainer.appendChild(btn);
      });
    }

    // --- Select Option ---
    function selectOption(questionIndex, optionKey) {
      var optionKeys = ['a', 'b', 'c', 'd'];
      var optionIndex = optionKeys.indexOf(optionKey);
      var type = questionMap[questionIndex].options[optionIndex];

      scores[type] += 1;

      // Highlight selected
      var buttons = optionsContainer.querySelectorAll('.option-btn');
      buttons[optionIndex].classList.add('selected');

      // Disable all buttons
      buttons.forEach(function (btn) {
        btn.disabled = true;
      });

      // Next question or result
      setTimeout(function () {
        if (currentQuestion < TOTAL_QUESTIONS - 1) {
          currentQuestion++;
          // Slide animation
          quizCard.classList.add('slide-out');
          setTimeout(function () {
            renderQuestion(currentQuestion);
            quizCard.classList.remove('slide-out');
            quizCard.classList.add('slide-in');
            setTimeout(function () {
              quizCard.classList.remove('slide-in');
            }, 300);
          }, 300);
        } else {
          showScreen(resultScreen);
          showResult();
        }
      }, 400);
    }

    // --- Calculate Result ---
    function getResult() {
      var types = ['secure', 'anxious', 'avoidant', 'fearful'];
      var sorted = types.slice().sort(function (a, b) {
        return scores[b] - scores[a];
      });
      return { primary: sorted[0], secondary: sorted[1] };
    }

    // --- Show Result ---
    function showResult() {
      var result = getResult();
      var primary = result.primary;
      var secondary = result.secondary;

      // Emoji
      document.getElementById('result-emoji').textContent = i18n.t('results.' + primary + '.emoji');

      // Type name
      document.getElementById('result-type').textContent = i18n.t('results.' + primary + '.name');

      // Description
      document.getElementById('result-desc').textContent = i18n.t('results.' + primary + '.desc');

      // Traits
      var traitsList = document.getElementById('result-traits');
      traitsList.innerHTML = '';
      var traits = i18n.t('results.' + primary + '.traits');
      if (Array.isArray(traits)) {
        traits.forEach(function (trait) {
          var li = document.createElement('li');
          li.textContent = trait;
          traitsList.appendChild(li);
        });
      }

      // Ideal partner
      document.getElementById('result-partner').textContent = i18n.t('results.' + primary + '.idealPartner');

      // Advice
      document.getElementById('result-advice').textContent = i18n.t('results.' + primary + '.advice');

      // Secondary type
      document.getElementById('secondary-type-text').textContent =
        i18n.t('results.' + secondary + '.emoji') + ' ' + i18n.t('results.' + secondary + '.name');

      // Attachment meter position
      // avoidant = left (0%), secure = center (50%), anxious = right (100%)
      // fearful = between avoidant and anxious (25% or 75%)
      var meterPositions = {
        secure: 50,
        anxious: 85,
        avoidant: 15,
        fearful: 35
      };
      var indicator = document.getElementById('meter-indicator');
      // Start at center then animate
      indicator.style.left = '50%';
      setTimeout(function () {
        indicator.style.left = meterPositions[primary] + '%';
      }, 600);

      // Update meter labels with i18n
      var meterLabels = document.querySelector('.meter-labels');
      if (meterLabels) {
        var spans = meterLabels.querySelectorAll('span');
        if (spans.length >= 3) {
          spans[0].textContent = i18n.t('results.avoidant.name');
          spans[1].textContent = i18n.t('results.secure.name');
          spans[2].textContent = i18n.t('results.anxious.name');
        }
      }

      // GA4 event
      if (typeof gtag === 'function') {
        gtag('event', 'quiz_complete', {
          event_category: 'attachment_style',
          event_label: primary,
          value: scores[primary]
        });
      }
    }

    // --- Share: Twitter ---
    shareTwitter.addEventListener('click', function () {
      var result = getResult();
      var typeName = i18n.t('results.' + result.primary + '.name');
      var emoji = i18n.t('results.' + result.primary + '.emoji');
      var text = emoji + ' ' + typeName + ' - ' + i18n.t('share.twitter');
      var url = 'https://dopabrain.com/attachment-style/';
      window.open(
        'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url),
        '_blank',
        'noopener'
      );
    });

    // --- Share: Copy Link ---
    shareCopy.addEventListener('click', function () {
      var url = 'https://dopabrain.com/attachment-style/';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          showToast(i18n.t('share.copied'));
        });
      } else {
        // Fallback
        var ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(i18n.t('share.copied'));
      }
    });

    // --- Toast ---
    function showToast(message) {
      var existing = document.querySelector('.toast');
      if (existing) existing.remove();

      var toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);

      requestAnimationFrame(function () {
        toast.classList.add('show');
      });

      setTimeout(function () {
        toast.classList.remove('show');
        setTimeout(function () {
          toast.remove();
        }, 300);
      }, 2000);
    }

    // --- Retake ---
    retakeBtn.addEventListener('click', function () {
      currentQuestion = 0;
      scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };
      showScreen(startScreen);
    });

    // --- Hide Loader ---
    var loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.add('hidden');
    }

  } catch (e) {
    // i18n or init error — hide loader anyway
    console.error('App init error:', e);
    var loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');
  }
})();
