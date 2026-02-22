/* ========================================
   Attachment Style Test - Chat Simulator
   10 conversation scenarios
   4 types: secure, anxious, avoidant, fearful
   ======================================== */

(async function () {
  try {
    await i18n.loadTranslations(i18n.currentLang);
    i18n.updateUI();

    // --- Constants ---
    var TOTAL_SCENARIOS = 10;
    var TYPING_DELAY = 1200;
    var REPLY_SHOW_DELAY = 600;
    var NEXT_SCENARIO_DELAY = 800;

    // --- State ---
    var currentScenario = 0;
    var scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };
    var isAnimating = false;

    // Scoring map: each scenario, option a/b/c/d maps to a type
    var scenarioMap = [
      ['secure', 'anxious', 'avoidant', 'fearful'],
      ['secure', 'anxious', 'avoidant', 'fearful'],
      ['secure', 'anxious', 'avoidant', 'fearful'],
      ['secure', 'anxious', 'avoidant', 'fearful'],
      ['secure', 'anxious', 'avoidant', 'fearful'],
      ['secure', 'anxious', 'avoidant', 'fearful'],
      ['secure', 'anxious', 'avoidant', 'fearful'],
      ['secure', 'anxious', 'avoidant', 'fearful'],
      ['secure', 'anxious', 'avoidant', 'fearful'],
      ['secure', 'anxious', 'avoidant', 'fearful']
    ];

    // --- DOM ---
    var startScreen = document.getElementById('start-screen');
    var chatScreen = document.getElementById('chat-screen');
    var resultScreen = document.getElementById('result-screen');
    var startBtn = document.getElementById('start-btn');
    var chatArea = document.getElementById('chat-area');
    var replyArea = document.getElementById('reply-area');
    var replyHint = document.getElementById('reply-hint');
    var replyOptions = document.getElementById('reply-options');
    var chatCounter = document.getElementById('chat-counter');
    var phoneStatus = document.getElementById('phone-status');
    var statusTime = document.getElementById('status-time');
    var themeToggle = document.getElementById('theme-toggle');
    var langSelect = document.getElementById('lang-select');
    var retakeBtn = document.getElementById('retake-btn');
    var shareTwitter = document.getElementById('share-twitter');
    var shareCopy = document.getElementById('share-copy');

    // --- Theme ---
    function initTheme() {
      var saved = localStorage.getItem('theme');
      document.documentElement.setAttribute('data-theme', saved || 'dark');
    }

    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    initTheme();

    // --- Language ---
    langSelect.value = i18n.currentLang;

    langSelect.addEventListener('change', async function () {
      await i18n.setLanguage(this.value);
      if (chatScreen.classList.contains('active')) {
        // Re-render current scenario
        renderScenario(currentScenario, true);
      }
      if (resultScreen.classList.contains('active')) {
        showResult();
      }
    });

    // --- Clock ---
    function updateClock() {
      var now = new Date();
      var h = now.getHours();
      var m = now.getMinutes();
      statusTime.textContent = h + ':' + (m < 10 ? '0' : '') + m;
    }
    updateClock();
    setInterval(updateClock, 30000);

    // --- Screen Navigation ---
    function showScreen(screen) {
      [startScreen, chatScreen, resultScreen].forEach(function (s) {
        s.classList.remove('active');
      });
      screen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Start ---
    startBtn.addEventListener('click', function () {
      currentScenario = 0;
      scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };
      chatArea.innerHTML = '';
      showScreen(chatScreen);
      renderScenario(0, false);
    });

    // --- Render Scenario ---
    function renderScenario(index, isRerender) {
      if (isAnimating && !isRerender) return;
      isAnimating = true;

      var num = index + 1;
      chatCounter.textContent = num + ' / ' + TOTAL_SCENARIOS;

      // Clear reply options
      replyOptions.innerHTML = '';
      replyOptions.classList.add('hidden');
      replyHint.style.display = 'none';

      if (!isRerender) {
        // Add context label
        var contextText = i18n.t('scenarios.s' + num + '.context');
        if (contextText) {
          var contextEl = document.createElement('div');
          contextEl.className = 'chat-context';
          contextEl.innerHTML = '<span>' + escapeHtml(contextText) + '</span>';
          chatArea.appendChild(contextEl);
        }

        // Show typing indicator
        showTypingIndicator();

        // After delay, show partner message
        setTimeout(function () {
          removeTypingIndicator();
          var partnerMsg = i18n.t('scenarios.s' + num + '.partnerMsg');
          addBubble(partnerMsg, 'incoming');

          // Show reply options after a short delay
          setTimeout(function () {
            showReplyOptions(index);
            isAnimating = false;
          }, REPLY_SHOW_DELAY);
        }, TYPING_DELAY);
      } else {
        // Re-render: just update reply options text
        showReplyOptions(index);
        isAnimating = false;
      }

      scrollChatToBottom();
    }

    // --- Show Typing Indicator ---
    function showTypingIndicator() {
      phoneStatus.textContent = i18n.t('chat.typing') || 'typing...';
      phoneStatus.style.color = 'var(--primary)';

      var typingEl = document.createElement('div');
      typingEl.className = 'typing-indicator';
      typingEl.id = 'typing-indicator';
      typingEl.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      chatArea.appendChild(typingEl);
      scrollChatToBottom();
    }

    // --- Remove Typing Indicator ---
    function removeTypingIndicator() {
      var el = document.getElementById('typing-indicator');
      if (el) el.remove();
      phoneStatus.textContent = i18n.t('chat.online') || 'online';
      phoneStatus.style.color = '#34d399';
    }

    // --- Add Chat Bubble ---
    function addBubble(text, type) {
      var bubble = document.createElement('div');
      bubble.className = 'chat-bubble ' + (type === 'incoming' ? 'bubble-incoming' : 'bubble-outgoing bubble-sending');
      bubble.textContent = text;
      chatArea.appendChild(bubble);
      scrollChatToBottom();
    }

    // --- Show Reply Options ---
    function showReplyOptions(scenarioIndex) {
      var num = scenarioIndex + 1;
      var optionKeys = ['a', 'b', 'c', 'd'];
      replyOptions.innerHTML = '';

      optionKeys.forEach(function (key) {
        var btn = document.createElement('button');
        btn.className = 'reply-btn';
        btn.textContent = i18n.t('scenarios.s' + num + '.options.' + key);
        btn.addEventListener('click', function () {
          selectReply(scenarioIndex, key);
        });
        replyOptions.appendChild(btn);
      });

      replyHint.style.display = 'block';
      replyOptions.classList.remove('hidden');
    }

    // --- Select Reply ---
    function selectReply(scenarioIndex, optionKey) {
      if (isAnimating) return;
      isAnimating = true;

      var optionKeys = ['a', 'b', 'c', 'd'];
      var optionIndex = optionKeys.indexOf(optionKey);
      var type = scenarioMap[scenarioIndex][optionIndex];
      scores[type] += 1;

      // Highlight selected button
      var buttons = replyOptions.querySelectorAll('.reply-btn');
      buttons.forEach(function (btn) { btn.disabled = true; });
      buttons[optionIndex].classList.add('selected');

      // After brief pause, show as sent message
      setTimeout(function () {
        var num = scenarioIndex + 1;
        var msgText = i18n.t('scenarios.s' + num + '.options.' + optionKey);
        addBubble(msgText, 'outgoing');

        // Hide reply options
        replyOptions.classList.add('hidden');
        replyHint.style.display = 'none';

        // Partner "reacts" with typing then next scenario
        setTimeout(function () {
          if (currentScenario < TOTAL_SCENARIOS - 1) {
            currentScenario++;
            renderScenario(currentScenario, false);
          } else {
            // Show results
            setTimeout(function () {
              showScreen(resultScreen);
              showResult();
              isAnimating = false;
            }, 400);
          }
        }, NEXT_SCENARIO_DELAY);
      }, 300);
    }

    // --- Scroll Chat ---
    function scrollChatToBottom() {
      requestAnimationFrame(function () {
        chatArea.scrollTop = chatArea.scrollHeight;
      });
    }

    // --- Escape HTML ---
    function escapeHtml(text) {
      var div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
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

      document.getElementById('result-emoji').textContent = i18n.t('results.' + primary + '.emoji');
      document.getElementById('result-type').textContent = i18n.t('results.' + primary + '.name');
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

      document.getElementById('result-partner').textContent = i18n.t('results.' + primary + '.idealPartner');
      document.getElementById('result-advice').textContent = i18n.t('results.' + primary + '.advice');
      document.getElementById('secondary-type-text').textContent =
        i18n.t('results.' + secondary + '.emoji') + ' ' + i18n.t('results.' + secondary + '.name');

      // Meter labels
      document.getElementById('meter-label-avoidant').textContent = i18n.t('results.avoidant.name');
      document.getElementById('meter-label-secure').textContent = i18n.t('results.secure.name');
      document.getElementById('meter-label-anxious').textContent = i18n.t('results.anxious.name');

      // Meter position
      var meterPositions = { secure: 50, anxious: 85, avoidant: 15, fearful: 35 };
      var indicator = document.getElementById('meter-indicator');
      indicator.style.left = '50%';
      setTimeout(function () {
        indicator.style.left = meterPositions[primary] + '%';
      }, 600);

      // GA4
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

    // --- Share: Copy ---
    shareCopy.addEventListener('click', function () {
      var url = 'https://dopabrain.com/attachment-style/';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          showToast(i18n.t('share.copied'));
        });
      } else {
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
        setTimeout(function () { toast.remove(); }, 300);
      }, 2000);
    }

    // --- Retake ---
    retakeBtn.addEventListener('click', function () {
      currentScenario = 0;
      scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };
      chatArea.innerHTML = '';
      showScreen(startScreen);
    });

    // --- Hide Loader ---
    var loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');

  } catch (e) {
    console.error('App init error:', e);
    var loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');
  }
})();
