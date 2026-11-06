(() => {
  if (window.cscAnalyticsInstalled) return;
  window.cscAnalyticsInstalled = true;

  const measurementId = 'G-TVLV6JYB3G';
  const consentKey = 'csc-analytics-consent-v1';
  let consent = null;
  let loaded = false;

  try {
    consent = localStorage.getItem(consentKey);
  } catch {
    // Visitors with storage disabled can still make a session-only choice.
  }

  window[`ga-disable-${measurementId}`] = consent !== 'accepted';

  function enableAnalytics() {
    window[`ga-disable-${measurementId}`] = false;
    if (loaded) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  function disableAnalytics() {
    window[`ga-disable-${measurementId}`] = true;
    if (window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    const parts = location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < parts.length - 1; i += 1) {
      domains.push(parts.slice(i).join('.'));
    }
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      if (name !== '_ga' && !name.startsWith('_ga_')) return;
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; Path=/` +
          (domain ? `; Domain=${domain}` : '');
      });
    });
  }

  const panel = document.createElement('section');
  panel.id = 'csc-cookie-panel';
  panel.setAttribute('aria-label', 'Analytics cookie preferences');
  panel.style.cssText = 'position:fixed;bottom:70px;left:12px;right:12px;max-width:460px;max-height:65vh;overflow:auto;box-sizing:border-box;padding:20px;background:#181b1d;color:#fff;border:1px solid #73777b;border-radius:14px;box-shadow:0 12px 40px #0006;z-index:10000;font:15px/1.5 Arial,sans-serif;';

  const description = document.createElement('p');
  description.textContent = 'Can we use Google Analytics cookies to understand how visitors use our website? These are optional. You can change your choice at any time.';
  description.style.cssText = 'margin:0 0 12px;color:#fff;';
  panel.appendChild(description);

  const privacy = document.createElement('a');
  privacy.href = '/privacy';
  privacy.textContent = 'Privacy notice';
  privacy.style.cssText = 'color:#fff;text-decoration:underline;display:inline-block;margin-bottom:12px;';
  panel.appendChild(privacy);

  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;';
  panel.appendChild(actions);

  const settings = document.createElement('button');
  settings.type = 'button';
  settings.textContent = 'Cookie settings';
  settings.setAttribute('aria-controls', panel.id);
  settings.style.cssText = 'position:fixed;bottom:12px;left:12px;z-index:9999;min-height:44px;padding:10px 14px;border-radius:8px;background:#181b1d;color:#fff;border:1px solid #aaa;font:14px Arial,sans-serif;cursor:pointer;';

  function showPanel(open) {
    panel.hidden = !open;
    settings.setAttribute('aria-expanded', String(open));
  }

  for (const label of ['Accept', 'Reject']) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.style.cssText = 'min-height:44px;padding:10px 20px;border-radius:8px;border:1px solid #aaa;background:#fff;color:#181b1d;font:bold 15px Arial,sans-serif;cursor:pointer;';
    button.addEventListener('click', () => {
      consent = label === 'Accept' ? 'accepted' : 'rejected';
      try {
        localStorage.setItem(consentKey, consent);
      } catch {
        // Session-only preference when storage is unavailable.
      }
      if (consent === 'accepted') enableAnalytics();
      else disableAnalytics();
      showPanel(false);
      settings.focus();
    });
    actions.appendChild(button);
  }

  settings.addEventListener('click', () => {
    showPanel(true);
    actions.firstElementChild.focus();
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== consentKey && event.key !== null) return;
    consent = event.key === null ? null : event.newValue;
    if (consent === 'accepted') enableAnalytics();
    else disableAnalytics();
    showPanel(consent !== 'accepted' && consent !== 'rejected');
  });

  showPanel(consent !== 'accepted' && consent !== 'rejected');
  document.body.append(panel, settings);
  if (consent === 'accepted') enableAnalytics();
})();
