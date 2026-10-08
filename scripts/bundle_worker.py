"""Bundle private lookup and public assets into a server-only Worker module."""
from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
assets={('/' if p.name=='index.html' else '/'+p.name):p.read_text() for p in (root/'web').iterdir() if p.is_file()}
records=json.loads((root/'private/records.json').read_text())['records']
handler=(root/'worker/handler.js').read_text()
(root/'worker/index.js').write_text('const assets='+json.dumps(assets)+';\nconst records='+json.dumps(records)+';\n'+handler)
print('Bundled public assets and server-only lookup records.')
