"""Hover Dock: a frontend-wide bottom hover navigation bar."""
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry

DOMAIN = "hover_dock"
FRONTEND_URL = "/hover_dock/hover-dock.js"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Serve and load the dock JavaScript on Home Assistant pages."""
    js_path = Path(__file__).parent / "frontend" / "hover-dock.js"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL, str(js_path), cache_headers=False)]
    )
    add_extra_js_url(hass, FRONTEND_URL)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """This frontend-wide module is unloaded at the next HA restart."""
    return True
