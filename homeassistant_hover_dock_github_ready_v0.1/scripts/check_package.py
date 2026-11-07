#!/usr/bin/env python3
"""Basic offline checks; not a substitute for HACS/hassfest."""
from pathlib import Path
import ast, json, sys
root=Path(__file__).resolve().parents[1]
comp=root/'custom_components/hover_dock'
for f in comp.glob('*.py'):
    ast.parse(f.read_text(), filename=str(f))
for f in [root/'hacs.json', comp/'manifest.json', comp/'strings.json', comp/'translations/en.json']:
    json.loads(f.read_text())
manifest=json.loads((comp/'manifest.json').read_text())
assert manifest['domain']=='hover_dock'
assert (comp/'frontend/hover-dock.js').is_file()
assert (root/'LICENSE').is_file()
print('PASS: local structure, JSON, Python syntax')
if 'REPLACE_WITH_GITHUB_USERNAME' in (comp/'manifest.json').read_text():
    print('PUBLISHING BLOCKER: replace GitHub owner placeholders in manifest.json')
    sys.exit(2)
print('PASS: publisher URLs configured; run GitHub validation for compatibility')
