# Home Assistant Hover Dock

An **auto-hiding navigation dock** for Home Assistant: hover at the bottom edge to reveal shortcuts to Developer Tools, Automations, Integrations, Entities and Settings.

> Community prototype v0.1.0. Tested by an early user on Home Assistant, but not yet validated on every Home Assistant release, mobile browser, or installation type.

## Features

- Bottom-center hover trigger with theme-aware dock
- Custom shortcuts via the pencil/edit button, including arbitrary *internal* Home Assistant routes
- Keyboard shortcut **Alt+D**, Escape to dismiss
- Automatically loaded on Home Assistant pages (not just dashboards)
- No cloud calls, accounts, or additional Python dependencies

## Install with Marketplace / HACS

Once the GitHub repository is published, go to **Settings → Marketplace → Add from link** and enter its public GitHub URL. Earlier versions of Home Assistant use HACS → Custom repositories → Integration. Install, restart Home Assistant, add the **Hover Dock** integration in **Settings → Devices & services**, then refresh your browser.

**This archive is a repository source package, not a Marketplace release yet.**

## Manual install (Home Assistant Container / Portainer)

Copy `custom_components/hover_dock` into your Home Assistant configuration directory. Restart Home Assistant, add **Hover Dock** from **Settings → Devices & services → Add integration**, restart once more, and hard-refresh the browser. Existing users of v0.1.0 may simply overwrite the integration folder; keep the same integration ID.

## Use

Move your mouse to the **bottom center** of Home Assistant. Click **✎** to edit shortcuts. Format:

```text
Energy | ⚡ | /energy
Automations | ⚙ | /config/automation/dashboard
```

Up to 16 links; local paths only. Preferences are saved in your **browser localStorage**, so they are not shared across devices or user accounts and can reset when browser storage is cleared.

## Limitations and security

- Does not bypass Home Assistant permissions; admin pages remain restricted.
- Home Assistant frontend routing may change between releases.
- Touchscreens do not have hover, so this prototype is principally for desktop use.
- The dock may remain until browser refresh after the integration is unloaded; restart may be needed to remove injected scripts.
- No telemetry or external network requests are made by the dock.
- Navigation uses only internal routes to avoid redirecting outside Home Assistant.

## Development and publishing

See [PUBLISHING.md](PUBLISHING.md). Run `python3 scripts/check_package.py` and check the GitHub Actions validation before publishing.

## License

[MIT](LICENSE).
