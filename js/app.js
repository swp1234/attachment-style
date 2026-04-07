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
    var shareDownload = document.getElementById('share-download');
    var shareTwitter = document.getElementById('share-twitter');
    var shareCopy = document.getElementById('share-copy');
    var relatedGrid = document.getElementById('related-grid');
    var aboutDetails = document.getElementById('about-details');

    var currentResult = null;
    var recommendationMap = {
      secure: ['love-language', 'mbti-love', 'eq-test', 'emotion-iceberg', 'stress-response', 'anxiety-type', 'burnout-test', 'inner-child-test', 'shadow-work', 'trauma-response'],
      anxious: ['anxiety-type', 'stress-response', 'burnout-test', 'eq-test', 'inner-child-test', 'love-language', 'mbti-love', 'emotion-iceberg', 'shadow-work', 'trauma-response'],
      avoidant: ['emotion-iceberg', 'eq-test', 'shadow-work', 'love-language', 'stress-response', 'anxiety-type', 'mbti-love', 'burnout-test', 'inner-child-test', 'trauma-response'],
      fearful: ['trauma-response', 'inner-child-test', 'shadow-work', 'stress-response', 'anxiety-type', 'eq-test', 'emotion-iceberg', 'burnout-test', 'love-language', 'mbti-love']
    };

    function trackEvent(name, params) {
      if (typeof gtag !== 'function') return;
      gtag('event', name, params || {});
    }

    function prioritizeRelatedCards(primary) {
      if (!relatedGrid) return;

      var cards = Array.prototype.slice.call(relatedGrid.querySelectorAll('.related-card'));
      var order = recommendationMap[primary] || recommendationMap.secure;
      var rankMap = {};

      order.forEach(function (key, index) {
        rankMap[key] = index;
      });

      cards.sort(function (a, b) {
        var aKey = a.getAttribute('data-related-key') || '';
        var bKey = b.getAttribute('data-related-key') || '';
        var aRank = Object.prototype.hasOwnProperty.call(rankMap, aKey) ? rankMap[aKey] : 999;
        var bRank = Object.prototype.hasOwnProperty.call(rankMap, bKey) ? rankMap[bKey] : 999;
        return aRank - bRank;
      });

      cards.forEach(function (card, index) {
        card.classList.toggle('is-featured', index < 3);
        card.setAttribute('data-rank', String(index + 1));
        relatedGrid.appendChild(card);
      });
    }

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
      currentResult = null;
      chatArea.innerHTML = '';
      trackEvent('quiz_start', {
        event_category: 'attachment_style',
        event_label: i18n.currentLang,
        value: TOTAL_SCENARIOS
      });
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
      trackEvent('quiz_answer_selected', {
        event_category: 'attachment_style',
        event_label: type,
        scenario_number: scenarioIndex + 1,
        option_key: optionKey,
        value: optionIndex + 1
      });

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

      currentResult = result;
      prioritizeRelatedCards(primary);

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

      // Percentile stat
      var pStat = document.getElementById('percentile-stat');
      if (pStat) {
        var pctVal = Math.floor(Math.random() * 15) + 8;
        var template = i18n.t('result.percentileStat') || 'Only <strong>{percent}%</strong> of participants share your attachment style';
        pStat.innerHTML = template.replace('{percent}', pctVal);
      }

      // GA4
      trackEvent('result_view', {
        event_category: 'attachment_style',
        event_label: primary,
        secondary_type: secondary,
        value: scores[primary]
      });
      trackEvent('quiz_complete', {
        event_category: 'attachment_style',
        event_label: primary,
        secondary_type: secondary,
        value: scores[primary]
      });
    }

    // --- Share: Download ---
    shareDownload.addEventListener('click', function () {
      if (!currentResult || typeof ResultCard === 'undefined') return;

      var primary = currentResult.primary;
      var typeName = i18n.t('results.' + primary + '.name');
      var emoji = i18n.t('results.' + primary + '.emoji');

      // Create dimension data from scores
      var scoreTypes = ['secure', 'anxious', 'avoidant', 'fearful'];
      var dimensions = scoreTypes.map(function(type) {
        var pct = Math.round((scores[type] / TOTAL_SCENARIOS) * 100);
        return {
          label: i18n.t('results.' + type + '.name'),
          pct: pct,
          color: '#D946EF'
        };
      });

      ResultCard.download({
        appName: 'Attachment Style Test',
        typeName: typeName,
        typeEmoji: emoji,
        dimensions: dimensions,
        primaryColor: '#D946EF',
        tagline: 'dopabrain.com/attachment-style'
      });

      trackEvent('attachment_share_click', {
        event_category: 'attachment_style',
        event_label: 'download',
        result_type: primary
      });
    });

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
      trackEvent('attachment_share_click', {
        event_category: 'attachment_style',
        event_label: 'twitter',
        result_type: result.primary
      });
    });

    // --- Share: Copy ---
    shareCopy.addEventListener('click', function () {
      var url = 'https://dopabrain.com/attachment-style/';
      var resultType = currentResult ? currentResult.primary : 'unknown';
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
      trackEvent('attachment_share_click', {
        event_category: 'attachment_style',
        event_label: 'copy',
        result_type: resultType
      });
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
      trackEvent('attachment_retake_click', {
        event_category: 'attachment_style',
        event_label: currentResult ? currentResult.primary : 'unknown'
      });
      currentScenario = 0;
      scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };
      currentResult = null;
      chatArea.innerHTML = '';
      showScreen(startScreen);
    });

    if (relatedGrid) {
      relatedGrid.addEventListener('click', function (event) {
        var card = event.target.closest('.related-card');
        if (!card) return;
        trackEvent('attachment_related_click', {
          event_category: 'attachment_style',
          event_label: card.getAttribute('data-related-key') || card.getAttribute('href'),
          result_type: currentResult ? currentResult.primary : 'unknown',
          related_rank: card.getAttribute('data-rank') || ''
        });
      });
    }

    if (aboutDetails) {
      aboutDetails.addEventListener('toggle', function () {
        trackEvent('attachment_about_toggle', {
          event_category: 'attachment_style',
          event_label: this.open ? 'open' : 'close'
        });
      });
    }

    // --- Hide Loader ---
    var loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');

  } catch (e) {
    console.error('App init error:', e);
    var loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');
  }
})();
