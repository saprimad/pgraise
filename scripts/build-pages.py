from pathlib import Path
import shutil
root=Path(__file__).resolve().parent.parent
out=root/'pages-dist'
if out.exists(): shutil.rmtree(out)
shutil.copytree(root/'web',out)
p=out/'index.html'
p.write_text(p.read_text().replace('<head>', '<head><meta name="lookup-origin" content="https://got-farmasi-sapri.saprimad.chatgpt.site">'))
(out/'.nojekyll').touch()
print('Built GitHub Pages frontend without student records.')
