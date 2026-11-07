/* Hover Dock 0.1 — Home Assistant navigation overlay (no external libraries). */
(() => {
  'use strict';
  if (window.__haHoverDockLoaded) return;
  window.__haHoverDockLoaded = true;

  const KEY = 'ha-hover-dock-links-v1';
  const DEFAULTS = [
    { label: 'Overview', icon: '⌂', path: '/lovelace' },
    { label: 'Developer', icon: '⌘', path: '/developer-tools' },
    { label: 'Automations', icon: '⚙', path: '/config/automation/dashboard' },
    { label: 'Integrations', icon: '◈', path: '/config/integrations' },
    { label: 'Entities', icon: '≡', path: '/config/entities' },
    { label: 'Settings', icon: '☷', path: '/config' }
  ];
  let links;
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    links = Array.isArray(stored) ? stored.filter(validLink) : DEFAULTS;
  } catch (_) { links = DEFAULTS; }

  function validLink(item) {
    return item && typeof item.label === 'string' &&
      typeof item.path === 'string' && item.path.startsWith('/') && !item.path.startsWith('//');
  }
  function go(path) {
    if (!path.startsWith('/') || path.startsWith('//')) return;
    history.pushState(null, '', path);
    window.dispatchEvent(new Event('location-changed'));
  }
  function install() {
    if (document.getElementById('ha-hover-dock-root') || !document.body) return;
    const host = document.createElement('div');
    host.id = 'ha-hover-dock-root';
    const root = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);
    root.innerHTML = `
      <style>
        :host { all: initial; font-family: var(--primary-font-family, system-ui, sans-serif); }
        .hit { position: fixed; z-index: 2147483000; left: 50%; bottom: 0; transform: translateX(-50%); height: 19px; width: min(720px, 96vw); }
        .tab { position: fixed; left: 50%; bottom: 0; transform: translateX(-50%); width: 96px; height: 5px; border-radius: 10px 10px 0 0; background: var(--primary-color, #03a9f4); opacity: .78; transition: opacity .16s; }
        .dock { position: fixed; z-index: 2147483001; bottom: 14px; left: 50%; transform: translate(-50%, calc(100% + 26px)); opacity: 0; pointer-events: none; display: flex; align-items: center; gap: 3px; padding: 7px; width: max-content; max-width: calc(100vw - 24px); overflow-x: auto; border: 1px solid var(--divider-color, #58616a); border-radius: 18px; color: var(--primary-text-color, #f6f6f6); background: var(--card-background-color, #222831); box-shadow: 0 12px 40px #0006; transition: transform .20s ease, opacity .20s ease; }
        :host(.show) .dock, :host(.editing) .dock { transform: translate(-50%, 0); opacity: 1; pointer-events: auto; }
        :host(.show) .tab, :host(.editing) .tab { opacity: 0; }
        button { font: inherit; color: inherit; cursor: pointer; background: transparent; border: 0; border-radius: 12px; padding: 8px 11px; white-space: nowrap; font-size: 12px; }
        button:hover, button:focus-visible { background: var(--secondary-background-color, #3a444e); outline: none; }
        .glyph { font-size: 20px; display: block; margin-bottom: 2px; line-height: 1.2; }
        .edit { border-left: 1px solid var(--divider-color, #58616a); border-radius: 0; margin-left: 2px; padding: 8px 12px; }
        .shade { position: fixed; z-index: 2147483002; inset: 0; background: #0008; display: grid; place-items: center; padding: 12px; }
        .editor { width: min(560px, 95vw); max-height: 85vh; overflow: auto; box-sizing: border-box; background: var(--card-background-color, #222831); color: var(--primary-text-color, #f6f6f6); border: 1px solid var(--divider-color, #58616a); border-radius: 18px; padding: 20px; box-shadow: 0 15px 50px #0008; font-size: 14px; }
        .editor h2 { margin: 0 0 8px; font-size: 20px; }
        .editor p { color: var(--secondary-text-color, #b4b7be); line-height: 1.4; }
        textarea { box-sizing: border-box; width: 100%; min-height: 240px; padding: 12px; background: var(--primary-background-color, #171a20); color: var(--primary-text-color, #fff); border: 1px solid var(--divider-color, #777); border-radius: 9px; font: 12px/1.5 monospace; }
        .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
        .actions button { border: 1px solid var(--divider-color, #777); font-size: 14px; }
        .actions .primary { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
        .error { color: #e85d65 !important; min-height: 18px; }
        @media (max-width: 600px) { .dock { bottom: 12px; } button { padding: 8px 9px; font-size: 11px; } }
        @media (prefers-reduced-motion: reduce) { .dock { transition: none; } }
      </style>
      <div class="hit" aria-hidden="true"><div class="tab"></div></div>
      <nav class="dock" aria-label="Hover Dock"><div class="links"></div><button class="edit" type="button" title="Edit shortcuts" aria-label="Edit shortcuts">✎</button></nav>
      <div class="modal"></div>`;
    const hit = root.querySelector('.hit');
    const dock = root.querySelector('.dock');
    let closing;
    function show() { clearTimeout(closing); host.classList.add('show'); }
    function hide() { clearTimeout(closing); closing = setTimeout(() => { if (!host.classList.contains('editing')) host.classList.remove('show'); }, 300); }
    hit.addEventListener('mouseenter', show);
    hit.addEventListener('mouseleave', hide);
    dock.addEventListener('mouseenter', show);
    dock.addEventListener('mouseleave', hide);
    dock.addEventListener('focusin', show);
    dock.addEventListener('focusout', hide);
    // Keyboard users can access the dock without hovering.
    window.addEventListener('keydown', (ev) => {
      if (ev.altKey && ev.key.toLowerCase() === 'd' && !ev.repeat) { ev.preventDefault(); host.classList.toggle('show'); }
      if (ev.key === 'Escape') { root.querySelector('.modal').replaceChildren(); host.classList.remove('editing', 'show'); }
    });
    function render() {
      const holder = root.querySelector('.links');
      holder.replaceChildren();
      for (const {label, icon, path} of links) {
        const b = document.createElement('button');
        b.type = 'button'; b.title = label;
        const glyph = document.createElement('span'); glyph.className = 'glyph'; glyph.textContent = icon || '•';
        const text = document.createElement('span'); text.textContent = label;
        b.append(glyph, text);
        b.addEventListener('click', () => { go(path); host.classList.remove('show'); });
        holder.appendChild(b);
      }
    }
    function editor() {
      host.classList.add('editing');
      const modal = root.querySelector('.modal');
      modal.innerHTML = `<div class="shade"><div class="editor" role="dialog" aria-modal="true" aria-label="Edit dock shortcuts"><h2>Edit hover dock</h2><p>One link per line: <b>Label | icon | /path</b>. Use local Home Assistant paths only. Changes save in this browser.</p><textarea spellcheck="false"></textarea><p class="error" role="status"></p><div class="actions"><button type="button" class="reset">Defaults</button><button type="button" class="cancel">Cancel</button><button type="button" class="primary save">Save</button></div></div></div>`;
      const txt = modal.querySelector('textarea');
      function serialize(items) { return items.map(x => `${x.label} | ${x.icon} | ${x.path}`).join('\n'); }
      txt.value = serialize(links);
      function close() { modal.replaceChildren(); host.classList.remove('editing'); }
      modal.querySelector('.cancel').addEventListener('click', close);
      modal.querySelector('.reset').addEventListener('click', () => { txt.value = serialize(DEFAULTS); });
      modal.querySelector('.save').addEventListener('click', () => {
        try {
          const parsed = txt.value.split('\n').filter(x => x.trim() && !x.trim().startsWith('#')).map((line) => {
            const parts = line.split('|').map(x => x.trim());
            if (parts.length !== 3 || !parts[0] || !parts[2]) throw Error(`Invalid line: ${line}`);
            const link = {label:parts[0].slice(0,35), icon:parts[1].slice(0,4), path:parts[2]};
            if (!validLink(link)) throw Error(`Invalid local path: ${parts[2]}`);
            return link;
          });
          if (!parsed.length || parsed.length > 16) throw Error('Use 1–16 links.');
          links = parsed;
          localStorage.setItem(KEY, JSON.stringify(links));
          render(); close();
        } catch (err) { modal.querySelector('.error').textContent = err.message; }
      });
      txt.focus();
    }
    root.querySelector('.edit').addEventListener('click', editor);
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();
