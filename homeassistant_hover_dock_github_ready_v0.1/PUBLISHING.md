# Publishing checklist (repository owner)

1. Create a **public** GitHub repository named `homeassistant-hover-dock` and upload the **contents** of this archive to the repository root (not the zip itself).
2. Replace every `REPLACE_WITH_GITHUB_USERNAME` string in `custom_components/hover_dock/manifest.json` with your real GitHub owner/organization name. Keep documentation and issue tracker links pointing to the repository you own.
3. Run `python3 scripts/check_package.py`; commit the files and let `.github/workflows/validate.yml` run both HACS validation and hassfest. Address any failures before releasing.
4. Publish a GitHub **Release** (not only a tag) called `0.1.0` to match the manifest version.
5. Install/test through **Settings → Marketplace → Add from link** using your repository URL; confirm Add Integration, frontend load, hover behavior, navigation and edit/save.
6. For public catalog listing, submit a PR to https://github.com/hacs/default adding the repository to the integration catalog, after satisfying the HACS requirements. Follow https://contributors.home-assistant.io/marketplace/guides/catalog/. Catalog approval is separate from being installable as a custom repo.
7. Review brand/icon requirements at https://contributors.home-assistant.io/marketplace/guides/integrations/; Home Assistant brand registration may be required for the public catalog.

The GitHub account/repository is not provided with this ZIP, so manifest links are intentional placeholders until replaced. This project has not been submitted or accepted.
