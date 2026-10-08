"""Extract PH timeline and display profile fields for the server-side lookup."""
import sys, json, hashlib, zipfile, datetime, xml.etree.ElementTree as ET
ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(sys.argv[1]) as z:
    strings = [''.join(t.text or '' for t in x.iter('{'+ns['m']+'}t')) for x in ET.fromstring(z.read('xl/sharedStrings.xml'))]
    def rows(sheet):
        result = []
        for r in ET.fromstring(z.read(sheet)).findall('.//m:sheetData/m:row', ns):
            cells = {}
            for c in r:
                v = c.find('m:v', ns)
                text = v.text if v is not None else ''
                if c.attrib.get('t') == 's' and text:
                    text = strings[int(text)]
                cells[''.join(filter(str.isalpha, c.attrib['r']))] = text
            result.append(cells)
        return result
    parameters = {r['F']: float(r['H']) for r in rows('xl/worksheets/sheet3.xml') if r.get('F','').startswith('PH') and r.get('H')}
    records = {}
    for r in rows('xl/worksheets/sheet2.xml'):
        if r.get('H') != 'PH':
            continue
        try:
            date = datetime.datetime.strptime(r['K'], '%d/%m/%Y').date().isoformat()
            months = parameters[r['D']]
        except (KeyError, ValueError):
            continue
        key = hashlib.sha256(('got-farmasi-v1:'+r['B'].strip()).encode()).hexdigest()
        clean = lambda value: str(value or '').strip()
        records[key] = {
            'program': r['D'], 'level': r['J'], 'mode': r['G'],
            'registered': date, 'gotMonths': months,
            'name': clean(r.get('C')), 'faculty': 'Faculty of Pharmacy, UiTM',
            'mainSupervisor': clean(r.get('L')),
            'coSupervisors': [clean(r.get(column)) for column in ('N', 'P', 'R')
                              if clean(r.get(column)) not in ('', '0', '-')]
        }
    payload = {'sourceDate': '2026-09-29', 'faculty': 'PH', 'records': records}
    with open(sys.argv[2], 'w') as f:
        json.dump(payload, f, separators=(',',':'))
    print(f'Imported {len(records)} PH profiles. Raw student IDs and staff IDs excluded.')
