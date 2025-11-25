// Language Switcher for Sharjah International Company
(function() {
  'use strict';
  
  // Get current language from localStorage or default to Arabic
  let currentLang = localStorage.getItem('siteLanguage') || 'ar';
  
  // Initialize language on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Set Arabic as default and active
    currentLang = 'ar';
    localStorage.setItem('siteLanguage', 'ar');
    updateHTMLAttributes('ar');
    initLanguageSwitcher();
    applyLanguage('ar');
    updateActiveButton();
  });
  
  // Initialize language switcher button
  function initLanguageSwitcher() {
    const switcher = document.getElementById('language-switcher');
    const switcherMobile = document.getElementById('language-switcher-mobile');
    
    // Initialize desktop switcher
    if (switcher) {
      switcher.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const lang = this.getAttribute('data-lang');
          switchLanguage(lang);
        });
      });
    }
    
    // Initialize mobile switcher
    if (switcherMobile) {
      switcherMobile.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const lang = this.getAttribute('data-lang');
          switchLanguage(lang);
        });
      });
    }
    
    // Also listen to all lang-btn buttons (fallback)
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (!btn.hasAttribute('data-listener-attached')) {
        btn.setAttribute('data-listener-attached', 'true');
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const lang = this.getAttribute('data-lang');
          if (lang) {
            switchLanguage(lang);
          }
        });
      }
    });
    
    // Update active button
    updateActiveButton();
  }
  
  // Switch language
  function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('siteLanguage', lang);
    applyLanguage(lang);
    updateActiveButton();
    updateHTMLAttributes(lang);
    document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
  }
  
  // Apply language to all elements
  function applyLanguage(lang) {
    if (!translations[lang]) return;
    
    const trans = translations[lang];
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      if (trans[key]) {
        if (element.tagName === 'INPUT' && element.type === 'button') {
          element.value = trans[key];
        } else {
          // Check if element has child elements (like icons)
          const hasChildren = element.children.length > 0;
          const originalHTML = element.innerHTML;
          
          if (hasChildren) {
            // Preserve child elements (like <i> icons)
            const children = Array.from(element.children);
            const childrenHTML = children.map(child => child.outerHTML).join('');
            
            // Check if there's text before or after children
            const textBefore = originalHTML.match(/^([^<]+)/);
            const textAfter = originalHTML.match(/>([^<]+)</);
            
            if (textBefore && textBefore[1].trim()) {
              // Text before children - replace it
              element.innerHTML = trans[key] + ' ' + childrenHTML;
            } else if (textAfter && textAfter[1].trim()) {
              // Text after children - replace it
              element.innerHTML = childrenHTML + ' ' + trans[key];
            } else {
              // Only children, add text after
              element.innerHTML = childrenHTML + ' ' + trans[key];
            }
          } else {
            // No children, just replace text content
            element.textContent = trans[key];
          }
        }
      }
    });
    
    // Update HTML lang and dir attributes
    updateHTMLAttributes(lang);
  }
  
  // Update HTML attributes
  function updateHTMLAttributes(lang) {
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }
  
  // Update active button
  function updateActiveButton() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  // Expose switchLanguage function globally
  window.switchLanguage = switchLanguage;
  window.getCurrentLanguage = function() {
    return currentLang;
  };
})();

